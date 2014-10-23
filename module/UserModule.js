//import dependencies
var UserModule = (function () {
    function UserModule() {
    }
    UserModule.prototype.init = function (moduleManager) {
        this.moduleManager = moduleManager;
        var db = this.moduleManager.get("database");
        var routerModule = this.moduleManager.get("router");

        //routerModule.addRoutes(function(router: express.Router){
        //});
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
