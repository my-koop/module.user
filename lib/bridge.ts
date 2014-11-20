import UserModule = require("./module");
import metadata = require("../metadata/index");

class ModuleBridge implements mykoop.IModuleBridge {
  instance: UserModule;

  getInstance(): UserModule {
    return this.instance || (this.instance = new UserModule());
  }

  onAllModulesInitialized() {
    this.instance.init();
  }

  getModule(): mykoop.IModule {
    return this.getInstance();
  }

  getMetaData(callback: mykoop.ModuleMetaDataCallback): void {
    callback(null, metadata);
  }
}
var bridge: mykoop.IModuleBridge = new ModuleBridge;
export = bridge;
