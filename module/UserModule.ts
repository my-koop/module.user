import express = require("express");
import getUserProfileData = require("../lib/getUserProfileData");
import testEmailUnicity = require("../lib/testEmailUnicity");
//import dependencies

class UserModule implements mykoopuser.Module {
  moduleManager: mykoop.ModuleManager;
  db: mkdatabase.Module;

  init(moduleManager: mykoop.ModuleManager){
    this.moduleManager = moduleManager;
    var db = <mkdatabase.Module>this.moduleManager.get("database");
    var routerModule = <mykoop.Router>this.moduleManager.get("router");
    routerModule.addRoutes(function (router: express.Router) {
      router.get("/data/:id", getUserProfileData.bind(null, db));
      router.get("/testEmail/:email", testEmailUnicity.bind(null, db));
      return "/user";
    });

    if(db){
      this.db = db;
    }
  }

  get(): string {
    return "trollolol";
  }
}

export = UserModule;