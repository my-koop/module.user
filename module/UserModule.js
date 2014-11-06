var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var async = require("async");

var controllerList = require("../controllers/index");
var UserProfile = require("../classes/UserProfile");
var utils = require("mykoop-utils");
var nodepwd = require("pwd");
var getLogger = require("mykoop-logger");
var logger = getLogger(module);
var AuthenticationError = require("../classes/AuthenticationError");

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

    UserModule.prototype.login = function (loginInfo, callback) {
        //Get salt and passwordHash with email
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err, null);
            }

            var userInfo;
            var authError = new AuthenticationError(null, "Unable to authenticate.");

            async.waterfall([
                function makeQuery(next) {
                    connection.query("SELECT ?? FROM user WHERE email = ? ", [
                        ["id", "salt", "pwdhash"],
                        loginInfo.email
                    ], next);
                },
                function hasEmail(rows, fields, next) {
                    if (rows.length !== 1) {
                        //Email is not associated to a user.
                        return next(authError);
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
                        return next(authError);
                    }

                    next();
                }
            ], function result(err) {
                cleanup();

                if (err) {
                    return callback(err);
                }

                callback(null, {
                    id: userInfo.id,
                    email: userInfo.email
                });
            });
        }); //getConnection
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
                if (rows[0].isUnique !== 1) {
                    //Duplicate email
                    cleanup();
                    return callback(new Error("Duplicate Email"), null);
                } else {
                    var query = connection.query("UPDATE user SET ? WHERE id = ? ", [newProfile, id], function (err, rows) {
                        cleanup();
                        return callback(err, !err && rows.affectedRows === 1);
                    });
                }
            });
        }); //getConnection
    };
    return UserModule;
})(utils.BaseModule);

module.exports = UserModule;
