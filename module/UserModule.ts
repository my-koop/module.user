import express = require("express");
import controllerList = require("../controllers/index");
import UserProfile = require("../classes/UserProfile");
import utils = require("mykoop-utils");
var nodepwd = require('pwd');
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

  tryLogin(loginInfo : UserInterfaces.TryLogin, callback: (err: Error, result: boolean) => void) {
    //Get salt and passwordHash with email
    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        return callback(err, null);
      }
      var tableRows = ['id','salt','pwdhash'];
      var email = loginInfo.email;

      var query = connection.query(
        "SELECT ?? FROM user WHERE email = ? ",
        [tableRows,email],
        function(err, rows) {
          cleanup();
          if (err) {
            return callback(err, null);
          }
          if(rows.length !== 1){
            //Email is not associated to a user
            return callback(null,false);
          }
          var salt = rows[0].salt;
          var storedHash = rows[0].pwdhash;
          var enteredPassword = loginInfo.password;

          //Hash password with salt
          nodepwd.hash(enteredPassword,salt, function(err,hash){
            //compare hashed password with db
            if(hash === storedHash) {
              //Match
              //FIX ME: Store id in express session
              // XX = rows[0].id
              callback(null,true);
            } else {
              //Incorrect password
              callback(null,false);
            }


          });//hash
        }//anonymous function
      );//query
    });//getConnection
  }//tryLogin

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

  registerNewUser(profile: UserInterfaces.RegisterNewUser, callback: (err: Error, result: boolean) => void){
    //FIX ME : Add validation
    //FIX ME : Add unique email verification
    //TEMP UNTIL ABOVE ARE FIXED

    nodepwd.hash(profile.passwordToHash, function(err, salt, hash) {
      if(err){
        logger.debug(err);
        return callback(err,null);
      }

      var pwdhash = hash;
      var mysalt = salt;
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
        salt : mysalt,
        signupDate: currentDate
      };

      this.db.getConnection(function(err, connection, cleanup) {
        if(err) {
          return callback(err, null);
        }
        var query = connection.query(
          "INSERT INTO user SET ? ",
          [updateData],
          function(err, rows) {
            cleanup();
            if (err) {
              return callback(err, false);
            }
              return callback(null, rows.affectedRows === 1);
          }//function
        );//query
      });//getConnection
     });//hash
  }//registerNewUser
}//class

export = UserModule;
