var UserModuleControllers = require("./controllers");
var controllerList = require("../controllers/index");

//Import request classes
var UserProfile = require("../classes/UserProfile");

var UserModule = (function () {
    function UserModule() {
    }
    UserModule.prototype.getModuleManager = function () {
        return this.moduleManager;
    };

    UserModule.prototype.init = function (moduleManager) {
        this.moduleManager = moduleManager;
        var db = this.moduleManager.get("database");
        var routerModule = this.moduleManager.get("router");

        this.controllers = new UserModuleControllers(this);
        controllerList.attachControllers(this.controllers);

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

    //FIX ME : define email type
    UserModule.prototype.getSaltWithEmail = function (email, callback) {
        var salt;
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err, null);
            }
            var query = connection.query("SELECT salt FROM user WHERE email = ?", [email], function (err, rows) {
                cleanup();
                if (err) {
                    return callback(err, null);
                }

                if (rows.length == 1) {
                    return callback(null, rows[0].salt);
                }
                callback(new Error("No result"), null);
            });
        });
    };

    //FIX ME : define id type
    UserModule.prototype.getSaltWithId = function (id, callback) {
        var salt;
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err, null);
            }
            var query = connection.query("SELECT salt FROM user WHERE id = ?", [id], function (err, rows) {
                cleanup();
                if (err) {
                    return callback(err, null);
                }

                if (rows.length == 1) {
                    return callback(null, rows[0].salt);
                }
                callback(new Error("No result"), null);
            });
        });
    };

    //FIX ME : define email type
    UserModule.prototype.testEmailUnique = function (email, callback) {
        var isUnique = false;
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err, null);
            }
            var query = connection.query("SELECT (count(id)= 0) as isUnique FROM user WHERE email = ?", [email], function (err, rows) {
                cleanup();
                if (err) {
                    return callback(err, null);
                }

                callback(null, rows[0].isUnique === '1');
            });
        });
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
})();

module.exports = UserModule;
