import express = require("express");
import UserModuleControllers = require("./controllers");
//Import request classes
import UserProfile = require("../classes/UserProfile");

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
  //Ajouter la reception des parametres
  tryLogin(callback: (err: Error, result: bool) => void) {
    this.db.getConnection(function(err, connection, cleanup) {
      var query = connection.query(
        "SELECT (count(id)= 1) as isValid FROM user WHERE email = ? AND pwdhash = ?",
        [email,passwordHash],
        function(err, rows) {
          if (err){
            res.status(500).end({ error: err.toString() });
            return;
          }

          if(rows[0].isValid == 1){
            //Email is unique
            isValid = true;
          } 
          cleanup();
          callback(null, isValid);
      });
    });
  }
   //FIX ME : Must pass email parameter to request
  getSaltWithEmail(callback: (err: Error, result: string) => void) {
    var salt;
    this.db.getConnection(function(err, connection, cleanup) {
      var query = connection.query(
        "SELECT salt FROM user WHERE email = ?",
        [email],
        function(err, rows) {
          if (err){
            res.status(500).end({ error: err.toString() });
            return;
          }
          if(rows.length == 1){
            //We have salt, what about pepper?
            salt = rows[0].salt;
          } 
          cleanup();
          callback(null, salt);
      });
    });
  }
  //FIX ME : Must pass id parameter to request
  getSaltWithId(callback: (err: Error, result: string) => void) {
    var salt;
    this.db.getConnection(function(err, connection, cleanup) {
      var query = connection.query(
        "SELECT salt FROM user WHERE id = ?",
        [id],
        function(err, rows) {
          if (err){
            res.status(500).end({ error: err.toString() });
            return;
          }
          if(rows.length == 1){
            //We have salt, what about pepper?
            salt = rows[0].salt;
          } 
          cleanup();
          callback(null, salt);
      });
    });
  }
  //FIX ME : Must pass email parameter to request
  testEmailUnique(callback: (err: Error, result: boolean) => void) {
    var isUnique = false;
    this.db.getConnection(function(err, connection, cleanup) {
      var query = connection.query(
        "SELECT (count(id)= 0) as isUnique FROM user WHERE email = ?",
        [email],
        function(err, rows) {
          if (err){
            res.status(500).end({ error: err.toString() });
            return;
          }
          if(rows[0].isUnique == '1'){
            //Email is unique
            isUnique = true;
          }
          cleanup();
          callback(null, isUnique);
      });
    });
  }
  //FIX ME : Must pass id parameter to request
  getProfile(callback: (err: Error, result: boolean) => void) {
    var profil;
    this.db.getConnection(function(err, connection, cleanup) {
      var query = connection.query(
        "SELECT ?? FROM user WHERE id = ?",
        [UserProfile.COLUMNS,id],
        function(err, rows) {
          if (err || rows.length !== 1) {
            res.status(500).end({ error: err.toString() });
            return;
          }
          var userRow = rows[0];
          profil = new UserProfile(userRow);
          
          cleanup();
          callback(null, profil);
      });
    });
  }
  
}

export = UserModule;