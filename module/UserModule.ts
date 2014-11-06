import express = require("express");
import controllerList = require("../controllers/index");
import UserProfile = require("../classes/UserProfile");
import utils = require("mykoop-utils");
var async = require("async");
var nodepwd = require("pwd");
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
          nodepwd.hash(enteredPassword, salt, function(err,hash){
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
  getProfile(id:number, callback: (err: Error, result: UserProfile) => void) {
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
    var self = this;
    nodepwd.hash(profile.passwordToHash, function(err, salt, hash) {
      if(err){
        logger.debug(err);
        return callback(err, null);
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

      self.db.getConnection(function(err, connection, cleanup) {
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

  updateProfile(id:number, newProfile: mkuser.UserProfile, callback: (err: Error, result: boolean) => void){
    var self: mkuser.Module =  this;
    this.db.getConnection(function(err, connection, cleanup) {
        if(err) {
          return callback(err, null);
        }
        var query = connection.query(
          "SELECT (count(*) = 0) as isUnique FROM user WHERE email = ? AND id != ? ",
          [newProfile.email, id],
          function(err, rows) {
            if (err) {
              cleanup();
              return callback(err, false);
            }
            if(rows[0].isUnique !== 1){
              //Duplicate email
              cleanup();
              return callback(new Error("Duplicate Email"), null);
            } else {
              var query = connection.query(
                "UPDATE user SET ? WHERE id = ? ",
                [newProfile,id],
                function(err, rows) {
                  cleanup();
                  return callback(err, !err && rows.affectedRows === 1);
                }//function
              );//update query
            }
        }//function
      );//test email unique query
    });//getConnection
  }
  updatePassword(id:number, passwords: UserInterfaces.updatePassword, callback: (err: Error) => void) {
    var self: mkuser.Module = this;
    //get salt and password hash with ID
    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        return callback(err);
      }
      async.waterfall([
        function(callback) {
          var query = connection.query(
            "SELECT ?? FROM user  WHERE id = ? ",
            [["salt", "pwdhash"], id],
            function(err, rows) {
              var myError = null;
              if(err) {
                myError = new utils.errors.DatabaseError(err, "SELECT salt and pwdhash caused an error.");
              }
              if (rows.length !== 1) {
                myError = new utils.errors.ApplicationError(null, {} , "Select returned more than a single row");
              }
              callback(myError, rows[0].pwdhash, rows[0].salt);
            }
          );
        },
        function(userHash, userSalt, callback){
          nodepwd.hash(passwords.oldPassword, userSalt, function(err, hash){
            var myError = null;
            if(err){
              myError = new utils.errors.ApplicationError(err, "Error while hasing current password.");
            }
            if(hash !== userHash){
              myError = new utils.errors.ApplicationError(null, {}, "Provided password doesn't match current one");
            }
            callback(myError, userSalt);
          });
        },
        function(userSalt, callback) {
          nodepwd.hash(passwords.newPassword, userSalt, function(err, newHash) {
            var myError = null;
            if(err){
              myError = new utils.errors.ApplicationError(err, {}, "Error hashing new password");
            }
            callback(myError, newHash);
          });
        },
        function(newHash, callback) {
          var query = connection.query(
            "UPDATE user SET pwdhash = ? WHERE id = ? ",
            [newHash, id],
            function(err, rows) {
              var myError = null;
              if(err) {
                myError = new utils.errors.DatabaseError(err, "Databse error while updating user password");
              }
              logger.debug(rows);
              if( rows.affectedRows !== 1) {
                myError =  new utils.errors.ApplicationError(null, {}, "Update request did not affect change to user row");
              }
              callback(myError);
            }
          );
        }
      ], function(err) {
          cleanup();
          callback(err);
      });
    });//getConnection
  }// updatePassword
}//class

export = UserModule;
