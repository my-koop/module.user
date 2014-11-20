var UserModule = require("./module");
var metadata = require("../metadata/index");
var ModuleBridge = (function () {
    function ModuleBridge() {
    }
    ModuleBridge.prototype.getInstance = function () {
        return this.instance || (this.instance = new UserModule());
    };
    ModuleBridge.prototype.onAllModulesInitialized = function () {
        this.instance.init();
    };
    ModuleBridge.prototype.getModule = function () {
        return this.getInstance();
    };
    ModuleBridge.prototype.getMetaData = function (callback) {
        callback(null, metadata);
    };
    return ModuleBridge;
})();
var bridge = new ModuleBridge;
module.exports = bridge;
