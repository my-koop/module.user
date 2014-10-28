var UserModuleControllers = (function () {
    function UserModuleControllers(user) {
        this.user = user;
        this.moduleManager = this.user.getModuleManager();
        this.routerModule = this.moduleManager.get("router");
    }
    UserModuleControllers.prototype.attach = function (params, controller) {
        this.routerModule.addRoute(params, controller.bind(this.user));
    };
    return UserModuleControllers;
})();

module.exports = UserModuleControllers;
