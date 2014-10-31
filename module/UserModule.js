var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var controllerList = require("../controllers/index");

//Import request classes
var UserProfile = require("../classes/UserProfile");
var utils = require("mykoop-utils");

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
        //FIX ME : Add salt generation and password encryption
        //TEMP UNTIL ABOVE ARE FIXED
        var salt = "salty and sweet";
        var pwdhash = "WERTUERTF";
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
            salt: salt,
            signupDate: currentDate
        };
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err, null);
            }
            var query = connection.query("INSERT INTO user SET ? ", [updateData], function (err, rows) {
                cleanup();
                if (err) {
                    return callback(err, false);
                }

                if (rows.length === 1) {
                    return callback(null, true);
                }
            });
        });
    };
    return UserModule;
})(utils.BaseModule);

module.exports = UserModule;
