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

  getMetaData(callback: mykoop.ModuleMetaDataCallback): void {
    // Avoid hardcoding data as much as possible here. Use require calls
    // whenever possible. Routes are hardcoded at the moment, pending the
    // route meta data utility.

    callback(null, {
      routes: {
        public:{
          children: {
            example: {
              children: {
                somePage: {
                  handler: {
                    resolve: "component",
                    value: "Component1"
                  },
                  name: "example",
                  path: "/example"
                }
              }
            }
          }
        }
      },
      translations: require("../locales")
    });
  }
}

var bridge: mykoop.IModuleBridge = new ModuleBridge();
export = bridge;

