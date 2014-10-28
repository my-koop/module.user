import express = require("express");
import UserModuleControllers = require("./controllers");
import getUserProfileData = require("../lib/getUserProfileData");
import testEmailUnicity = require("../lib/testEmailUnicity");
import getUserSaltWithEmail = require("../lib/getUserSaltWithEmail");
import tryLogin = require("../lib/tryLogin");
//import dependencies

class UserModule implements mykoopuser.Module {
  moduleManager: mykoop.ModuleManager;
  db: mkdatabase.Module;
  private controllers: UserModuleControllers;
  
  init(moduleManager: mykoop.ModuleManager){
    this.moduleManager = moduleManager;
    var db = <mkdatabase.Module>this.moduleManager.get("database");
    var routerModule = <mykoop.Router>this.moduleManager.get("router");
    
    this.controllers = new UserModuleControllers(this);
    controllerList.attachControllers(this.controllers);

    if(db){
      this.db = db;
    }
  }

  get(): string {
    return "trollolol";
  }
}

export = UserModule;