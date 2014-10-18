var Module = require("./module");

var ModuleBridge = (function () {
    function ModuleBridge() {
    }
    ModuleBridge.prototype.getInstance = function () {
        return this.instance || (this.instance = new Module());
    };

    ModuleBridge.prototype.onAllModulesInitialized = function (moduleManager) {
        this.getInstance().init(moduleManager);
    };

    ModuleBridge.prototype.getModule = function () {
        return this.getInstance();
    };

    // FIXME: add typing information once metadata pipeline done
    ModuleBridge.prototype.getMetaData = function (callback) {
        return {};
    };
    return ModuleBridge;
})();

var bridge = new ModuleBridge();
module.exports = bridge;
