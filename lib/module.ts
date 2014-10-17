
class Module implements mykoopuser.Module {
  moduleManager: mykoop.ModuleManager;

  init(moduleManager: mykoop.ModuleManager){
    this.moduleManager = moduleManager;
    //moduleManager.get("")
  }
  get():string{ 
  	return ""
  }

  method1(par1: string): string{
    return "";
  }
}

export = Module;
