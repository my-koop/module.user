import async = require("async");
import express = require("express");
import controllerList = require("./controllers/index");
import UserProfile = require("./classes/UserProfile");
import utils = require("mykoop-utils");
var nodepwd = require("pwd");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

var DatabaseError = utils.errors.DatabaseError;
var ApplicationError = utils.errors.ApplicationError;
import AuthenticationError = require("./classes/AuthenticationError");

class UserModule extends utils.BaseModule implements mkuser.Module {
  db: mkdatabase.Module;

  static deserializePermissions(permissions) {
    function deepTraverse(obj) {
      //TODO.
    }

    // Trust the permissions are valid serialized JSON.
    var perms = JSON.parse(permissions);

    // Traverse the permissions and replace all instances of "" (empty string)
    // by true (boolean).
    //TODO.

    return perms;
  }

  init() {
    var db = <mkdatabase.Module>this.getModuleManager().get("database");
    var routerModule = <mykoop.Router>this.getModuleManager().get("router");

    controllerList.attachControllers(new utils.ModuleControllersBinder(this));

    this.db = db;
  }

  userExists(
    params: User.IdExists.Params,
    callback: User.IdExists.Callback
  ) {
    this.callWithConnection(
      this.__userExists,
      params,
      callback
    );
  }

  __userExists(
    connection: mysql.IConnection,
    params: User.IdExists.Params,
    callback: User.IdExists.Callback
  ) {
    connection.query(
      "SELECT id FROM user WHERE id=?",
      [params.id],
      function(err, res) {
        callback(
          (err && new DatabaseError(err)) ||
          (res.length !== 1 && new ApplicationError(null, {id: "invalid"}))
        );
      }
    );
  }

  login(
    loginInfo : UserInterfaces.LoginRequestData,
    callback: (err: Error, result?: mkuser.LoginResponse) => void
  ) {
    //Get salt and passwordHash with email
    this.db.getConnection(function(err, connection, cleanup) {
      if (err) {
        return callback(new DatabaseError(err));
      }

      var userInfo;
      var computedPermissions = <any>{};
      async.waterfall([
        function makeQuery(next) {
          connection.query(
            "SELECT ?? FROM user WHERE email = ? ",
            [
              ["id", "salt", "pwdhash", "perms"],
              loginInfo.email
            ],
            function (err, rows) {
              if (err) {
                return next(new DatabaseError(err));
              }

              next(null, rows);
            }
          );
        },
        function hasEmail(rows, next) {
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
        },
        function computePermissions(next) {
          //TODO: Eventually to support permission masks, additionnal queries
          // would be required here.
          // See https://github.com/my-koop/service.website/issues/277

          // Users can be permission-less.
          if (userInfo.perms) {
            // We trust the database data, so we don't wrap this in a try-catch,
            // which means bogus serialized JSON would make us crash.
            computedPermissions = UserModule.deserializePermissions(
              userInfo.perms
            );
          }

          // All logged in users have this permission, it makes it easy to
          // "demand" that a user be logged in through any permission tool.
          computedPermissions.loggedin = 1;

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
          email: loginInfo.email,
          perms: computedPermissions
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
              myError = new utils.errors.ApplicationError(err,  {}, "Error while hasing current password.");
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

  getIdForEmail(params, callback) {
    this.callWithConnection(this.__getIdForEmail, params, callback);
  }

  __getIdForEmail(connection, params, callback) {
    connection.query(
      "SELECT id FROM user WHERE email = ?",
      params.email,
      function(err, result) {
        var id = -1;
        if(result.length === 1) {
          id = result[0].id;
        }
        callback(err && new DatabaseError(err), id);
      }
    );
  }


}//class

export = UserModule;
