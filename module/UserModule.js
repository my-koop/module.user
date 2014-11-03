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

            this.db.getConnection(function (err, connection, cleanup) {
                if (err) {
                    logger.debug(err);
                    return callback(err, null);
                }
                var query = connection.query("INSERT INTO user SET ? ", [updateData], function (err, rows) {
                    cleanup();
                    if (err) {
                        logger.debug(err);
                        return callback(err, false);
                    }
                    if (rows.affectedRows === 1) {
                        return callback(null, true);
                    }
                });
            });
        });
    };
    return UserModule;
})(utils.BaseModule);

module.exports = UserModule;
