import async = require("async");
import express = require("express");
import controllerList = require("./controllers/index");
import UserProfile = require("./classes/UserProfile");
import utils = require("mykoop-utils");
var nodepwd = require("pwd");
var traverse = require("traverse");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

var _ = require("lodash");

var DatabaseError = utils.errors.DatabaseError;
var ApplicationError = utils.errors.ApplicationError;
import AuthenticationError = require("./classes/AuthenticationError");

class UserModule extends utils.BaseModule implements mkuser.Module {
  db: mkdatabase.Module;

  static serializePermissions(permissions) {
    // Assume the passed-in permissions are meant to be mutated.

    // Traverse the permissions and do some replacements/simplifications.
    traverse(permissions).forEach(function(perm) {
      // Called after traversing all the children, delete ourselves if we don't
      // have children anymore (deleted themselves).
      this.post(function (parentPerm) {
        if (_.isEqual(parentPerm.node, {})) {
          this.delete();
        }
      });

      if (perm === true) {
        // Replace all instances of true (boolean) by "" (empty string).
        this.update("");
      } else if (perm === false) {
        // Delete all instances of false.
        this.delete();
      }
    });

    return JSON.stringify(permissions);
  }

  static deserializePermissions(permissions) {
    // Trust the permissions are valid serialized JSON.
    var perms = JSON.parse(permissions);

    // Traverse the permissions and replace all instances of "" (empty string)
    // by true (boolean).
    traverse(perms).forEach(function(perm) {
      if (perm === "") {
        this.update(true);
      }
    });

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
          if(rows.length !== 1) {
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
          computedPermissions.loggedIn = true;

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
            rows[0].perms = UserModule.deserializePermissions(rows[0].perms);
            return callback(null, new UserProfile(rows[0]));
          }
          callback(new Error("No result"), null);

      });
    });
  }

  registerNewUser(
    params: mkuser.RegisterNewUser.Params,
    callback: mkuser.RegisterNewUser.Callback
  ) {
    this.callWithConnection(this.__registerNewUser, params, callback);
  }

  __registerNewUser(
    connection: mysql.IConnection,
    params: mkuser.RegisterNewUser.Params,
    callback: mkuser.RegisterNewUser.Callback
  ) {
    //FIX ME : Add validation
    var self = this;
    async.waterfall([
      function checkEmail(next) {
        self.__getIdForEmail(connection, {email: params.email}, next);
      },
      function(id, next) {
        if(id !== -1) {
          return next(new ApplicationError(null, {email: "duplicate"}));
        }
        next();
      },
      function hashPwd(next) {
        nodepwd.hash(params.passwordToHash, function(err, salt, hash) {
          if(err) {
            logger.verbose(typeof err);
            return next(new ApplicationError(err, {passwordToHash: "invalid"}));
          }
          next(null, salt, hash);
        });
      },
      function createUser(salt, hash) {

        var updateData: dbQueryStruct.RegisterUser = {
          email: params.email,
          firstname: params.firstname,
          lastname : params.lastname,
          birthdate: params.birthdate,
          phone: params.phone,
          origin: params.origin,
          usageFrequency: params.usageFrequency,
          usageNote : params.usageNote,
          referral : params.referral,
          pwdhash : hash,
          salt : salt,
        };
        connection.query(
          "INSERT INTO user SET ?",
          [updateData],
          function(err, rows) {
            if (err) {
              return callback(new DatabaseError(err));
            }
            if(rows.affectedRows !== 1) {
              return callback(new ApplicationError(null, {}));
            }
            return callback(null, {id: rows.insertId});
          }
        );
      }
    ], <any>callback);
  }

  updateProfile(id:number, newProfile: mkuser.UserProfile, callback: (err: Error, result: boolean) => void) {
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
            if(rows[0].isUnique !== 1) {
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
        function(userHash, userSalt, callback) {
          nodepwd.hash(passwords.oldPassword, userSalt, function(err, hash) {
            var myError = null;
            if(err) {
              myError = new utils.errors.ApplicationError(err,  {}, "Error while hasing current password.");
            }
            if(hash !== userHash) {
              myError = new utils.errors.ApplicationError(null, {}, "Provided password doesn't match current one");
            }
            callback(myError, userSalt);
          });
        },
        function(userSalt, callback) {
          nodepwd.hash(passwords.newPassword, userSalt, function(err, newHash) {
            var myError = null;
            if(err) {
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

  getIdForEmail(
    params: mkuser.GetIdForEmail.Params,
    callback: mkuser.GetIdForEmail.Callback
  ) {
    this.callWithConnection(this.__getIdForEmail, params, callback);
  }

  __getIdForEmail(
    connection: mysql.IConnection,
    params: mkuser.GetIdForEmail.Params,
    callback: mkuser.GetIdForEmail.Callback
  ) {
    connection.query(
      "SELECT id FROM user WHERE email = ?",
      params.email || "",
      function(err, result) {
        var id = -1;
        if(result && result.length === 1) {
          id = result[0].id;
        }
        callback(err && new DatabaseError(err), id);
      }
    );
  }

  private updatePermissions(
    id:number,
    newPermissions,
    callback: (err: Error, result: boolean) => void
  ) {
    var self: mkuser.Module =  this;
    this.db.getConnection(function(err, connection, cleanup) {
        if(err) {
          return callback(err, null);
        }

        var query = connection.query(
          "UPDATE user SET perms = ? WHERE id = ?",
          [UserModule.serializePermissions(newPermissions), id],
          function(err, rows) {
            cleanup();
            return callback(err, !err && rows.affectedRows === 1);
          }//function
        );//update query
    });//getConnection
  }

  getUsersList(params, callback) {
    this.callWithConnection(this.__getUsersList, params, callback);
  }

  __getUsersList(connection, params:{}, callback: (err: Error, users) => void ) {
    var self: mkuser.Module =  this;
    var query = connection.query(
      "SELECT \
         user.id, \
         user.email,\
         user.firstname,\
         user.lastname,\
         (isnull(bill.closedDate) != 1 )as isMember, \
         member.subscriptionExpirationDate as activeUntil  \
       FROM user \
       LEFT JOIN member ON user.id = member.id \
       LEFT JOIN bill ON member.feeTransactionId = bill.idbill \
       ",
      function(err, rows) {
        callback(err && new DatabaseError(err), {users: _.map(rows, function(row) { return row; }) } );

      }//function
    );
  }

  getNotesForId(params, callback) {
    this.callWithConnection(this.__getNotesForId, params, callback);
  }

  __getNotesForId(connection, params, callback: (err: Error, notes) => void) {

    var query = connection.query(
      "SELECT \
         user_notes.date, \
         user_notes.message, \
         concat(user.firstname,' ', user.lastname) as author \
       FROM user_notes \
       LEFT JOIN user ON user_notes.authorId = user.id \
       WHERE user_notes.targetId = ? \
       ORDER by user_notes.date desc",
       [params.id],
       function(err, rows) {
         callback(err && new DatabaseError(err),
           { notes: _.map(rows, function(row) { return row} ) }
         );
       }
    );
  }

  newNote(params: dbQueryStruct.NewNote, callback) {
    this.callWithConnection(this.__newNote, params, callback);
  }

  __newNote(connection, params, callback) {
    var query = connection.query(
      "INSERT INTO user_notes SET ?",
      [params],
      function(err, res) {
        callback(err && new DatabaseError(err));
      }
    );
  }
}//class

export = UserModule;
