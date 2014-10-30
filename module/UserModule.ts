import express = require("express");
import controllerList = require("../controllers/index");
//Import request classes
import UserProfile = require("../classes/UserProfile");
import utils = require("mykoop-utils");

class UserModule extends utils.BaseModule implements mkuser.Module {
  db: mkdatabase.Module;

  init() {
    var db = <mkdatabase.Module>this.getModuleManager().get("database");
    var routerModule = <mykoop.Router>this.getModuleManager().get("router");

    controllerList.attachControllers(new utils.ModuleControllersBinder(this));

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
