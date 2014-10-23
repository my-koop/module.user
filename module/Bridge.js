var UserModule = require("./UserModule");
var metadata = require("../metadata/index");

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

    ModuleBridge.prototype.getMetaData = function (callback) {
        callback(null, metadata);
    };
    return ModuleBridge;
})();
var bridge = new ModuleBridge;
module.exports = bridge;
