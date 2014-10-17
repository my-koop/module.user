import express = require("express");
//import dependencies

class UserModule implements mkinventory.Module {
  moduleManager: mykoop.ModuleManager;
  db: mkdatabase.Module;

  init(moduleManager: mykoop.ModuleManager){
    this.moduleManager = moduleManager;
    var db = <mkdatabase.Module>this.moduleManager.get("database");
    var routerModule = <any>this.moduleManager.get("router");
    //routerModule.addRoutes(function(router: express.Router){
    //});

    if(db){
      this.db = db;
    }
  }

  get(): string {
    return "trollolol";
  }
}

export = UserModule;