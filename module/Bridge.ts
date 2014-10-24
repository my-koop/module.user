import UserModule = require("./UserModule");
import metadata = require("../metadata/index");

class ModuleBridge implements mykoop.IModuleBridge {
  instance: UserModule;

  constructor(){
    this.instance = new UserModule();
  }

  onAllModulesInitialized(moduleManager: mykoop.ModuleManager){
    console.log("Yo yo yo user module is in the house.");
    this.instance.init(moduleManager);
  }

  getModule() : mykoop.IModule {
    return this.instance;
  }

  getMetaData(callback: mykoop.ModuleMetaDataCallback): void {
    callback(null, metadata);
  }
}
var bridge: mykoop.IModuleBridge = new ModuleBridge;
export = bridge;