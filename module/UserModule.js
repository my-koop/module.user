var getUserProfileData = require("../lib/getUserProfileData");
var testEmailUnicity = require("../lib/testEmailUnicity");
var getUserSaltWithEmail = require("../lib/getUserSaltWithEmail");
var tryLogin = require("../lib/tryLogin");

//import dependencies
var UserModule = (function () {
    function UserModule() {
    }
    UserModule.prototype.init = function (moduleManager) {
        this.moduleManager = moduleManager;
        var db = this.moduleManager.get("database");
        var routerModule = this.moduleManager.get("router");
        routerModule.addRoutes(function (router) {
            router.get("/data/:id", getUserProfileData.bind(null, db));
            router.get("/testEmail/:email", testEmailUnicity.bind(null, db));
            router.get("/getSalt/:email", getUserSaltWithEmail.bind(null, db));
            router.get("/tryLogin/:email/:pwdhash", tryLogin.bind(null, db));
            return "/user";
        });

        if (db) {
            this.db = db;
        }
    };

    UserModule.prototype.get = function () {
        return "trollolol";
    };
    return UserModule;
})();

module.exports = UserModule;
