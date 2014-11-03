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
var nodepwd = require("pwd");

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

    UserModule.prototype.tryLogin = function (loginInfo, callback) {
        //Get salt and passwordHash with email
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err, null);
            }
            var tableRows = ['id', 'salt', 'pwdhash'];
            var email = loginInfo.email;

            var query = connection.query("SELECT ?? user WHERE email = ? ", [tableRows, email], function (err, rows) {
                cleanup();
                if (err) {
                    return callback(err, null);
                }
                if (rows.length !== 1) {
                    //Email is not associated to a user
                    return callback(null, false);
                }
                var salt = rows[0].salt;
                var storedHash = rows[0].pwdhash;
                var enteredPassword = loginInfo.password;

                //Hash password with salt
                nodepwd.hash(enteredPassword, salt, function (err, hash) {
                    //compare hashed password with db
                    if (hash === storedHash) {
                        //Match
                        //FIX ME: Store id in express session
                        // XX = rows[0].id
                        callback(null, true);
                    } else {
                        //Incorrect password
                        callback(null, false);
                    }
                }); //hash
            });
        }); //getConnection
    };

    //FIX ME : define id type
    UserModule.prototype.getProfile = function (id, callback) {
        var profil;
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
    return UserModule;
})(utils.BaseModule);

module.exports = UserModule;
