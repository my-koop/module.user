var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var controllerList = require("../controllers/index");
var UserProfile = require("../classes/UserProfile");
var utils = require("mykoop-utils");
var nodepwd = require('pwd');
var getLogger = require("mykoop-logger");
var logger = getLogger(module);

var UserModule = (function (_super) {
    __extends(UserModule, _super);
    function UserModule() {
        _super.apply(this, arguments);
    }
    UserModule.prototype.init = function () {
        var db = this.getModuleManager().get("database");
        var routerModule = this.getModuleManager().get("router");

        controllerList.attachControllers(new utils.ModuleControllersBinder(this));

        this.db = db;
    };

    // FIXME:: add type to args
    UserModule.prototype.tryLogin = function (email, passwordHash, callback) {
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err, null);
            }
            var query = connection.query("SELECT (count(id)= 1) as isValid FROM user WHERE email = ? AND pwdhash = ?", [email, passwordHash], function (err, rows) {
                cleanup();
                if (err) {
                    return callback(err, false);
                }

                callback(null, rows[0].isValid === 1);
            });
        });
    };

    //FIX ME : define id type
    UserModule.prototype.getProfile = function (id, callback) {
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err, null);
            }
            var query = connection.query("SELECT ?? FROM user WHERE id = ?", [UserProfile.COLUMNS, id], function (err, rows) {
                cleanup();
                if (err) {
                    return callback(err, null);
                }

                if (rows.length === 1) {
                    return callback(null, new UserProfile(rows[0]));
                }
                callback(new Error("No result"), null);
            });
        });
    };

    UserModule.prototype.registerNewUser = function (profile, callback) {
        //FIX ME : Add validation
        //FIX ME : Add unique email verification
        //TEMP UNTIL ABOVE ARE FIXED
        var self = this;
        nodepwd.hash(profile.passwordToHash, function (err, salt, hash) {
            if (err) {
                logger.debug(err);
                return callback(err, null);
            }

            var pwdhash = hash;
            var mysalt = salt;
            var currentDate = new Date();

            var updateData = {
                email: profile.email,
                firstname: profile.firstname,
                lastname: profile.lastname,
                birthdate: profile.birthdate,
                phone: profile.phone,
                origin: profile.origin,
                usageFrequency: profile.usageFrequency,
                usageNote: profile.usageNote,
                referral: profile.referral,
                pwdhash: pwdhash,
                salt: mysalt,
                signupDate: currentDate
            };

            self.db.getConnection(function (err, connection, cleanup) {
                if (err) {
                    return callback(err, null);
                }
                var query = connection.query("INSERT INTO user SET ? ", [updateData], function (err, rows) {
                    cleanup();
                    if (err) {
                        return callback(err, false);
                    }
                    return callback(null, rows.affectedRows === 1);
                });
            }); //getConnection
        }); //hash
    };

    UserModule.prototype.updateProfile = function (id, newProfile, callback) {
        var self = this;
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err, null);
            }
            var query = connection.query("SELECT (count(*) = 0) as isUnique FROM user WHERE email = ? AND id != ? ", [newProfile.email, id], function (err, rows) {
                if (err) {
                    cleanup();
                    return callback(err, false);
                }
                logger.verbose(rows);
                if (rows[0].isUnique !== 1) {
                    //Duplicate email
                    cleanup();
                    var myError = new Error("Duplicate Email");
                    logger.verbose(myError, {});
                    return callback(myError, null);
                } else {
                    var query = connection.query("UPDATE user SET ? WHERE id = ? ", [newProfile, id], function (err, rows) {
                        logger.verbose(rows);
                        cleanup();
                        if (err) {
                            return callback(err, false);
                        }
                        return callback(null, rows.affectedRows === 1);
                    });
                }
            });
        }); //getConnection
    };
    UserModule.prototype.updatePassword = function (id, passwords, callback) {
        var self = this;

        //basic validation
        if (passwords.newPassword !== passwords.confNewPassword || passwords.newPassword === null || passwords.confNewPassword === null || passwords.oldPassword === null) {
            return callback(new Error('Missing parameters in request'), null);
        }

        //get salt and password hash with ID
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err, null);
            }
            var query = connection.query("SELECT ?? FROM user  WHERE id = ? ", [['salt', 'pwdhash'], id], function (err, rows) {
                if (err) {
                    cleanup();
                    return callback(err, false);
                }
                logger.verbose(rows[0]);
                var oldHash = rows[0].pwdhash;
                var userSalt = rows[0].salt;

                //Hash old password and compare with stored Password
                nodepwd.hash(passwords.oldPassword, userSalt, function (err, hash) {
                    if (err) {
                        cleanup();
                        logger.verbose("Hashing error");
                        return callback(err, null);
                    }
                    if (hash !== oldHash) {
                        //No match
                        cleanup();
                        logger.verbose(hash);
                        logger.verbose("Old password doesnt match");
                        return callback(null, false);
                    } else {
                        //Match
                        //Hash new password using salt
                        nodepwd.hash(passwords.newPassword, userSalt, function (err, newHash) {
                            if (err) {
                                cleanup();
                                return callback(err, null);
                            }
                            logger.verbose(newHash);
                            var query = connection.query("UPDATE user SET pwdhash = ? WHERE id = ? ", [newHash, id], function (err, rows) {
                                cleanup();
                                if (err) {
                                    return callback(err, null);
                                }
                                logger.verbose(rows);
                                return callback(null, rows.affectedRows === 1);
                            });
                        }); // hash new password
                    }
                });
            });
        }); //getConnection
    };
    return UserModule;
})(utils.BaseModule);

module.exports = UserModule;
