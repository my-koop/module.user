import Module = require("./module");

class ModuleBridge implements mykoop.IModuleBridge {
  instance: Module;

  getInstance(): Module {
    return this.instance || (this.instance = new Module());
  }

  onAllModulesInitialized(moduleManager: mykoop.ModuleManager){
    this.getInstance().init(moduleManager);
  }

  getModule() : mykoop.IModule {
    return this.getInstance();
  }

  // FIXME: add typing information once metadata pipeline done
  getMetaData(callback: any) {
    return {};
  }
}

var bridge: mykoop.IModuleBridge = new ModuleBridge();
export = bridge;

