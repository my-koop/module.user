var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var async = require("async");
var controllerList = require("./controllers/index");
var UserProfile = require("./classes/UserProfile");
var utils = require("mykoop-utils");
var nodepwd = require("pwd");
var traverse = require("traverse");
var getLogger = require("mykoop-logger");
var logger = getLogger(module);
var generatePassword = require("password-generator");
var _ = require("lodash");
var DatabaseError = utils.errors.DatabaseError;
var ApplicationError = utils.errors.ApplicationError;
var AccessDeniedError = ApplicationError.AccessDeniedError;
var ResourceNotFoundError = ApplicationError.ResourceNotFoundError;
var AuthenticationError = require("./classes/AuthenticationError");
var UserModule = (function (_super) {
    __extends(UserModule, _super);
    function UserModule() {
        _super.apply(this, arguments);
    }
    UserModule.serializePermissions = function (permissions) {
        // Assume the passed-in permissions are meant to be mutated.
        // Traverse the permissions and do some replacements/simplifications.
        traverse(permissions).forEach(function (perm) {
            // Called after traversing all the children, delete ourselves if we don't
            // have children anymore (deleted themselves).
            this.post(function (parentPerm) {
                if (_.isEqual(parentPerm.node, {})) {
                    this.delete();
                }
            });
            if (perm === true) {
                // Replace all instances of true (boolean) by "" (empty string).
                this.update("");
            }
            else if (perm === false) {
                // Delete all instances of false.
                this.delete();
            }
        });
        return JSON.stringify(permissions);
    };
    UserModule.deserializePermissions = function (permissions) {
        // Trust the permissions are valid serialized JSON.
        var perms = JSON.parse(permissions);
        // Traverse the permissions and replace all instances of "" (empty string)
        // by true (boolean).
        traverse(perms).forEach(function (perm) {
            if (perm === "") {
                this.update(true);
            }
        });
        return perms;
    };
    UserModule.prototype.init = function () {
        var db = this.getModuleManager().get("database");
        var routerModule = this.getModuleManager().get("router");
        var communications = this.getModuleManager().get("communications");
        controllerList.attachControllers(new utils.ModuleControllersBinder(this));
        this.db = db;
        this.communications = communications;
    };
    UserModule.prototype.userExists = function (params, callback) {
        this.callWithConnection(this.__userExists, params, callback);
    };
    UserModule.prototype.__userExists = function (connection, params, callback) {
        connection.query("SELECT id FROM user WHERE id=?", [params.id], function (err, res) {
            callback((err && new DatabaseError(err)) || (res.length !== 1 && new ApplicationError(null, { id: "invalid" })));
        });
    };
    UserModule.prototype.login = function (loginInfo, callback) {
        //Get salt and passwordHash with email
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(new DatabaseError(err));
            }
            var userInfo;
            var computedPermissions = {};
            async.waterfall([
                function makeQuery(next) {
                    connection.query("SELECT ?? FROM user WHERE email = ? ", [
                        ["id", "salt", "pwdhash", "perms", "deactivated"],
                        loginInfo.email
                    ], function (err, rows) {
                        if (err) {
                            return next(new DatabaseError(err));
                        }
                        next(null, rows);
                    });
                },
                function hasEmail(rows, next) {
                    if (rows.length !== 1) {
                        //Email is not associated to a user.
                        return next(new AuthenticationError(null, "Couldn't find user email."));
                    }
                    userInfo = rows[0];
                    next();
                },
                function buildHash(next) {
                    nodepwd.hash(loginInfo.password, userInfo.salt, next);
                },
                function compareHashes(hash, next) {
                    if (hash !== userInfo.pwdhash) {
                        //Incorrect password
                        return next(new AuthenticationError(null, "Password doesn't match."));
                    }
                    if (userInfo.deactivated) {
                        return next(new AccessDeniedError(null, { email: "denied" }, "Account deactivated"));
                    }
                    next();
                },
                function computePermissions(next) {
                    //TODO: Eventually to support permission masks, additionnal queries
                    // would be required here.
                    // See https://github.com/my-koop/service.website/issues/277
                    // Users can be permission-less.
                    if (userInfo.perms) {
                        // We trust the database data, so we don't wrap this in a try-catch,
                        // which means bogus serialized JSON would make us crash.
                        computedPermissions = UserModule.deserializePermissions(userInfo.perms);
                    }
                    // All logged in users have this permission, it makes it easy to
                    // "demand" that a user be logged in through any permission tool.
                    computedPermissions.loggedIn = true;
                    next();
                }
            ], function result(err) {
                cleanup();
                if (err) {
                    return callback(err);
                }
                callback(null, {
                    id: userInfo.id,
                    email: loginInfo.email,
                    perms: computedPermissions
                });
            });
        }); //getConnection
    }; //tryLogin
    //FIX ME : define id type
    UserModule.prototype.getProfile = function (id, callback) {
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err, null);
            }
            connection.query("SELECT ?? FROM user WHERE id = ?", [UserProfile.COLUMNS, id], function (err, rows) {
                cleanup();
                if (err) {
                    return callback(err, null);
                }
                if (rows.length === 1) {
                    rows[0].perms = UserModule.deserializePermissions(rows[0].perms);
                    return callback(null, new UserProfile(rows[0]));
                }
                callback(new Error("No result"), null);
            });
        });
    };
    UserModule.prototype.registerNewUser = function (params, callback) {
        this.callWithConnection(this.__registerNewUser, params, callback);
    };
    UserModule.prototype.__registerNewUser = function (connection, params, callback) {
        //FIX ME : Add validation
        var self = this;
        async.waterfall([
            function checkEmail(next) {
                self.__getIdForEmail(connection, { email: params.email }, next);
            },
            function (id, next) {
                if (id !== -1) {
                    return next(new ApplicationError(null, { email: "duplicate" }));
                }
                next();
            },
            function hashPwd(next) {
                nodepwd.hash(params.passwordToHash, function (err, salt, hash) {
                    if (err) {
                        logger.verbose(typeof err);
                        return next(new ApplicationError(err, { passwordToHash: "invalid" }));
                    }
                    next(null, salt, hash);
                });
            },
            function createUser(salt, hash) {
                var updateData = {
                    email: params.email,
                    firstname: params.firstname,
                    lastname: params.lastname,
                    birthdate: params.birthdate,
                    phone: params.phone,
                    origin: params.origin,
                    usageFrequency: params.usageFrequency,
                    usageNote: params.usageNote,
                    referral: params.referral,
                    pwdhash: hash,
                    salt: salt,
                };
                connection.query("INSERT INTO user SET ?", [updateData], function (err, rows) {
                    if (err) {
                        return callback(new DatabaseError(err));
                    }
                    if (rows.affectedRows !== 1) {
                        return callback(new ApplicationError(null, {}));
                    }
                    return callback(null, { id: rows.insertId });
                });
            }
        ], callback);
    };
    UserModule.prototype.updateProfile = function (id, newProfile, callback) {
        var self = this;
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err, null);
            }
            connection.query("SELECT (count(*) = 0) as isUnique FROM user WHERE email = ? AND id != ? ", [newProfile.email, id], function (err, rows) {
                if (err) {
                    cleanup();
                    return callback(err, false);
                }
                if (rows[0].isUnique !== 1) {
                    //Duplicate email
                    cleanup();
                    return callback(new Error("Duplicate Email"), null);
                }
                else {
                    connection.query("UPDATE user SET ? WHERE id = ? ", [newProfile, id], function (err, rows) {
                        cleanup();
                        return callback(err, !err && rows.affectedRows === 1);
                    } //function
                    ); //update query
                }
            } //function
            ); //test email unique query
        }); //getConnection
    };
    UserModule.prototype.updatePassword = function (id, passwords, callback) {
        var self = this;
        //get salt and password hash with ID
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err);
            }
            async.waterfall([
                function (callback) {
                    connection.query("SELECT ?? FROM user WHERE id = ? ", [["salt", "pwdhash"], id], function (err, rows) {
                        if (err) {
                            return callback(new DatabaseError(err, "SELECT salt and pwdhash caused an error."));
                        }
                        if (rows.length !== 1) {
                            return callback(new ApplicationError(null, { id: "invalid" }));
                        }
                        callback(null, rows[0].pwdhash, rows[0].salt);
                    });
                },
                function (userHash, userSalt, callback) {
                    nodepwd.hash(passwords.oldPassword, userSalt, function (err, hash) {
                        if (err) {
                            return callback(new ApplicationError(err, { oldPassword: "invalid" }, "Error while hashing current password."));
                        }
                        if (hash !== userHash) {
                            return callback(new ApplicationError(null, { oldPassword: "invalid" }, "Provided password doesn't match current one"));
                        }
                        callback(null, userSalt);
                    });
                },
                function (userSalt, callback) {
                    nodepwd.hash(passwords.newPassword, userSalt, function (err, newHash) {
                        if (err) {
                            return callback(new ApplicationError(err, { newPassword: "invalid" }, "Error hashing new password"));
                        }
                        callback(null, newHash);
                    });
                },
                function (newHash, callback) {
                    connection.query("UPDATE user SET pwdhash = ? WHERE id = ?", [newHash, id], function (err, rows) {
                        if (err) {
                            return callback(new DatabaseError(err, "Database error while updating user password"));
                        }
                        logger.debug(rows);
                        // No need to check for errors because we already validate the
                        // user existed
                        callback();
                    });
                }
            ], function (err) {
                cleanup();
                callback(err);
            });
        });
    };
    UserModule.prototype.getIdForEmail = function (params, callback) {
        this.callWithConnection(this.__getIdForEmail, params, callback);
    };
    UserModule.prototype.__getIdForEmail = function (connection, params, callback) {
        connection.query("SELECT id FROM user WHERE email = ?", params.email || "", function (err, result) {
            var id = -1;
            if (result && result.length === 1) {
                id = result[0].id;
            }
            callback(err && new DatabaseError(err), id);
        });
    };
    UserModule.prototype.resetPassword = function (email, callback) {
        var self = this;
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err);
            }
            var password = generatePassword(8);
            async.waterfall([
                function getSaltWithEmail(next) {
                    logger.debug("Getting salt with email:", email);
                    connection.query("SELECT salt FROM user WHERE email = ?", [email], function (err, rows) {
                        if (err) {
                            return next(new DatabaseError(err), null);
                        }
                        if (_.isEmpty(rows)) {
                            return next(new ApplicationError(null, { email: "invalid" }));
                        }
                        next(null, rows[0].salt);
                    });
                },
                function generateNewPassword(salt, next) {
                    logger.debug("Generating new password");
                    nodepwd.hash(password, salt, function (err, hash) {
                        next(err, hash);
                    });
                },
                function updateUserPassword(passwordHash, next) {
                    logger.debug("Updating password to", password);
                    connection.query("UPDATE user SET pwdhash = ? WHERE email = ?", [passwordHash, email], function (err, rows) {
                        if (err) {
                            return next(new DatabaseError(err, "Database error while updating user password"));
                        }
                        logger.debug("Result of password update", rows);
                        // we can safely assume the update will succeed because we
                        // validated the email existed already
                        next(null);
                    });
                },
                function sendEmail(next) {
                    logger.debug("Update successful, sending email to user");
                    //prepare SendEmail object
                    var emailParams = {
                        subject: "CoopBécik - New Password / Nouveau mot de passe",
                        message: "Your new password / votre nouveau mot de passe: " + password,
                        to: email
                    };
                    self.communications.sendEmail(emailParams, next);
                }
            ], function (err) {
                cleanup();
                callback(err);
            });
        });
    };
    UserModule.prototype.updatePermissions = function (id, newPermissions, callback) {
        var self = this;
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err, null);
            }
            connection.query("UPDATE user SET perms = ? WHERE id = ?", [UserModule.serializePermissions(newPermissions), id], function (err, rows) {
                cleanup();
                return callback(err, !err && rows.affectedRows === 1);
            } //function
            ); //update query
        }); //getConnection
    };
    UserModule.prototype.getUsersList = function (params, callback) {
        this.callWithConnection(this.__getUsersList, params, callback);
    };
    UserModule.prototype.__getUsersList = function (connection, params, callback) {
        var self = this;
        connection.query("SELECT \
         user.id, \
         user.email,\
         user.firstname,\
         user.lastname,\
         (isnull(bill.closedDate) != 1 )as isMember, \
         member.subscriptionExpirationDate as activeUntil  \
       FROM user \
       LEFT JOIN member ON user.id = member.id \
       LEFT JOIN bill ON member.feeTransactionId = bill.idbill \
       ", function (err, rows) {
            callback(err && new DatabaseError(err), { users: _.map(rows, function (row) {
                return row;
            }) });
        } //function
        );
    };
    UserModule.prototype.getNotesForId = function (params, callback) {
        this.callWithConnection(this.__getNotesForId, params, callback);
    };
    UserModule.prototype.__getNotesForId = function (connection, params, callback) {
        connection.query("SELECT \
         user_notes.date, \
         user_notes.message, \
         concat(user.firstname,' ', user.lastname) as author \
       FROM user_notes \
       LEFT JOIN user ON user_notes.authorId = user.id \
       WHERE user_notes.targetId = ? \
       ORDER by user_notes.date desc", [params.id], function (err, rows) {
            callback(err && new DatabaseError(err), { notes: _.map(rows, function (row) {
                return row;
            }) });
        });
    };
    UserModule.prototype.newNote = function (params, callback) {
        this.callWithConnection(this.__newNote, params, callback);
    };
    UserModule.prototype.__newNote = function (connection, params, callback) {
        connection.query("INSERT INTO user_notes SET ?", [params], function (err, res) {
            callback(err && new DatabaseError(err));
        });
    };
    UserModule.prototype.userActivation = function (params, callback) {
        this.callWithConnection(this.__userActivation, params, callback);
    };
    UserModule.prototype.__userActivation = function (connection, params, callback) {
        var activation = params.activate ? null : 1;
        connection.query("UPDATE user SET deactivated=? WHERE id=?", [activation, params.id], function (err, res) {
            if (err) {
                return callback(new DatabaseError(err));
            }
            if (res.affectedRows !== 1) {
                return callback(new ResourceNotFoundError(null, { id: "notFound" }));
            }
            callback(null, { isActive: +params.activate });
        });
    };
    return UserModule;
})(utils.BaseModule); //class
module.exports = UserModule;
