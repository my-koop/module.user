var UserModule = require("./UserModule");
var utils = require("mykoop-utils");

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
        // Avoid hardcoding data as much as possible here. Use require calls
        // whenever possible.
        var metaData = new utils.MetaData();

        metaData.addRoute({
            idPath: ["public", "example", "somepage"],
            component: "Component1",
            name: "example",
            path: "/example"
        });

        metaData.addData("translations", require("../locales"));

        callback(null, metaData.get());
    };
    return ModuleBridge;
})();

module.exports = ModuleBridge;
