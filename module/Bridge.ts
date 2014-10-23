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

  getMetaData(callback: mykoop.ModuleMetaDataCallback): void {
    // Avoid hardcoding data as much as possible here. Use require calls
    // whenever possible.
    var metaData = new utils.MetaData();

    metaData.addRoute({
      idPath: ["public","example","somepage"],
      component: "Component1",
      name: "example",
      path: "/example"
    });

    metaData.addData("translations", require("../locales"));

    callback(null, metaData.get());
  }
}

export = ModuleBridge;