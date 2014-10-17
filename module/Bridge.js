var UserModule = require("./UserModule");
var ModuleBridge = (function () {
    function ModuleBridge() {
        this.instance = new UserModule();
    }
    ModuleBridge.prototype.onAllModulesInitialized = function (moduleManager) {
        this.instance.init(moduleManager);
    };
    ModuleBridge.prototype.getModule = function () {
        return this.instance;
    };
    return ModuleBridge;
})();
module.exports = ModuleBridge;
