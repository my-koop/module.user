import async = require("async");
import express = require("express");
import controllerList = require("../controllers/index");
import UserProfile = require("../classes/UserProfile");
import utils = require("mykoop-utils");
var nodepwd = require("pwd");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

var DatabaseError = utils.errors.DatabaseError;
import AuthenticationError = require("../classes/AuthenticationError");

class UserModule extends utils.BaseModule implements mkuser.Module {
  db: mkdatabase.Module;

  init() {
    var db = <mkdatabase.Module>this.getModuleManager().get("database");
    var routerModule = <mykoop.Router>this.getModuleManager().get("router");

    controllerList.attachControllers(new utils.ModuleControllersBinder(this));

    this.db = db;
  }

  login(
    loginInfo : UserInterfaces.LoginRequestData,
    callback: (err: Error, result?: mkuser.LoginResponse) => void
  ) {
    //Get salt and passwordHash with email
    this.db.getConnection(function(err, connection, cleanup) {
      if (err) {
        //FIXME: Remove error description after
        // https://github.com/my-koop/service.website/issues/240
        return callback(new DatabaseError(err, "Database error."));
      }

      var userInfo;
      async.waterfall([
        function makeQuery(next) {
          connection.query(
            "SELECT ?? FROM user WHERE email = ? ",
            [
              ["id", "salt", "pwdhash"],
              loginInfo.email
            ],
            next
          );
        },
        function hasEmail(rows, fields, next) {
          if(rows.length !== 1){
            //Email is not associated to a user.
            return next(new AuthenticationError(null, "Couldn't find user email."));
          }

          userInfo = rows[0];

          next();
        },
        function buildHash(next) {
          nodepwd.hash(
            loginInfo.password,
            userInfo.salt,
            next
          );
        },
        function compareHashes(hash, next) {
          if(hash !== userInfo.pwdhash) {
            //Incorrect password
            return next(new AuthenticationError(null, "Password doesn't match."));
          }

          next();
        }
      ],
      function result(err) {
        cleanup();

        if (err) {
          return callback(err);
        }

        callback(null, {
          id: userInfo.id,
          email: loginInfo.email
        });
      });
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
}//class

export = UserModule;
