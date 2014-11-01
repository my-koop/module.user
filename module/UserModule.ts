import express = require("express");
import controllerList = require("../controllers/index");
//Import request classes
import UserProfile = require("../classes/UserProfile");
import utils = require("mykoop-utils");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

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

  registerNewUser(profile: UserInterfaces.RegisterNewUser,callback: (err: Error, result: boolean) => void){
    //FIX ME : Add validation
    //FIX ME : Add salt generation and password encryption
    //FIX ME : Add unique email verification
    //TEMP UNTIL ABOVE ARE FIXED
    var salt = "salty and sweet";
    var pwdhash ="WERTUERTF";
    var currentDate = new Date();

    var updateData: dbQueryStruct.RegisterUser = {
      email: profile.email,
      firstname: profile.firstname,
      lastname : profile.lastname,
      birthdate: profile.birthdate,
      phone: profile.phone,
      origin: profile.origin,
      usageFrequency: profile.usageFrequency,
      usageNote : profile.usageNote,
      referral : profile.referral,
      pwdhash : pwdhash,
      salt : salt,
      signupDate: currentDate
    };

     this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        logger.debug(err);
        return callback(err, null);
      }
      var query = connection.query(
        "INSERT INTO user SET ? ",
        [updateData],
        function(err, rows) {
          cleanup();
          if (err) {
            logger.debug(err);
            return callback(err, false);
          }
          if(rows.affectedRows === 1 ) {
            return callback(null, true);
          }


      });
    });

  }
}

export = UserModule;
