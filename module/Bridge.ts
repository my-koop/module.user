import UserModule = require("./UserModule");

class ModuleBridge implements mykoop.IModuleBridge {
  instance: UserModule;

  constructor(){
    this.instance = new UserModule();
  }

  onAllModulesInitialized(moduleManager: mykoop.ModuleManager){
    this.instance.init(moduleManager);
  }

  getModule() : mykoop.IModule {
    return this.instance;
  }
}

export = ModuleBridge;