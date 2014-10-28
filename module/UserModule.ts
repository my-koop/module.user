import express = require("express");
import UserModuleControllers = require("./controllers");
import controllerList = require("../controllers/index");
//Import request classes
import UserProfile = require("../classes/UserProfile");

class UserModule implements mkuser.Module {
  moduleManager: mykoop.ModuleManager;
  db: mkdatabase.Module;
  private controllers: UserModuleControllers;

  getModuleManager(): mykoop.ModuleManager {
    return this.moduleManager;
  }

  init(moduleManager: mykoop.ModuleManager) {
    this.moduleManager = moduleManager;
    var db = <mkdatabase.Module>this.moduleManager.get("database");
    var routerModule = <mykoop.Router>this.moduleManager.get("router");

    this.controllers = new UserModuleControllers(this);
    controllerList.attachControllers(this.controllers);

    this.db = db;
  }

  // FIXME:: add type to args
  tryLogin(email, passwordHash, callback: (err: Error, result: boolean) => void) {
    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        return callback(err, null);
      }
      var query = connection.query(
        "SELECT (count(id)= 1) as isValid FROM user WHERE email = ? AND pwdhash = ?",
        [email,passwordHash],
        function(err, rows) {
          cleanup();
          if (err) {
            return callback(err, false);
          }

          callback(null, rows[0].isValid === 1);
      });
    });
  }

 //FIX ME : define email type
  getSaltWithEmail(email, callback: (err: Error, result: string) => void) {
    var salt;
    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        return callback(err, null);
      }
      var query = connection.query(
        "SELECT salt FROM user WHERE email = ?",
        [email],
        function(err, rows) {
          cleanup();
          if (err) {
            return callback(err, null);
          }

          if(rows.length == 1) {
            return callback(null, rows[0].salt);
          }
          callback(new Error("No result"), null);
      });
    });
  }

  //FIX ME : define id type
  getSaltWithId(id, callback: (err: Error, result: string) => void) {
    var salt;
    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        return callback(err, null);
      }
      var query = connection.query(
        "SELECT salt FROM user WHERE id = ?",
        [id],
        function(err, rows) {
          cleanup();
          if(err) {
            return callback(err, null);
          }

          if(rows.length == 1) {
            return callback(null, rows[0].salt);
          }
          callback(new Error("No result"), null);
      });
    });
  }

  //FIX ME : define email type
  testEmailUnique(email, callback: (err: Error, result: boolean) => void) {
    var isUnique = false;
    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        return callback(err, null);
      }
      var query = connection.query(
        "SELECT (count(id)= 0) as isUnique FROM user WHERE email = ?",
        [email],
        function(err, rows) {
          cleanup();
          if(err) {
            return callback(err, null);
          }

          callback(null, rows[0].isUnique === '1');
      });
    });
  }

  //FIX ME : define id type
  getProfile(id, callback: (err: Error, result: UserProfile) => void) {
    var profil;
    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        return callback(err, null);
      }
      var query = connection.query(
        "SELECT ?? FROM user WHERE id = ?",
        [UserProfile.COLUMNS,id],
        function(err, rows) {
          cleanup();
          if (err) {
            return callback(err, null);
          }

          if(rows.length === 1) {
            return callback(null, new UserProfile(rows[0]));
          }
          callback(new Error("No result"), null);

      });
    });
  }
}

export = UserModule;
