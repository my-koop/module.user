import endPoints = require("../../metadata/endpoints");
import validation = require("../validation/index");
import utils = require("mykoop-utils");
import Express = require("express");
import assert = require("assert");
// Assertions
assert.equal(endPoints.user.emailExists.method, "get");

// Helper controllers.
import attachSessionUserId = require("./attachSessionUserId");
import attachParamUserId = require("./attachParamUserId");
import validateCurrentUser = require("./validateCurrentUser");

// Controllers.
import login = require("./login");
import logout = require("./logout");
import getProfile = require("./getProfile");
import getSession = require("./getSession");
import registerUser = require("./registerUser");
import updateProfile = require("./updateProfile");
import updatePassword = require("./updatePassword");
import updatePermissions = require("./updatePermissions");

export function attachControllers(
  binder: utils.ModuleControllersBinder<mkuser.Module>
) {
  binder.attach(
    {
      endPoint: endPoints.user.login,
      customPermissionGranted: function (req, callback) {
        callback(req.session.user && new Error("Already logged in."));
      }
    },
    login
  );
  binder.attach(
    {endPoint: endPoints.user.current.getSession},
    getSession
  );
  binder.attach(
    {endPoint: endPoints.user.current.logout},
    logout
  );
  binder.attach(
    {
      endPoint: endPoints.user.exists
    },
    binder.makeSimpleController("userExists", function(req: Express.Request) {
      var params: User.IdExists.Params = {
        id: parseInt(req.param("id")) || 0
      };
      return params;
    })
  );
  binder.attach(
    {
      endPoint: endPoints.user.getPublicProfile,
      permissions: {
        user: {
          profile: {
            full: true
          }
        }
      },
      customPermissionDenied: validateCurrentUser
    },
    getProfile.getPublicProfile
  );
  binder.attach(
    {
      endPoint: endPoints.user.register,
      customPermissionGranted: function (req, callback) {
        callback(req.session.user && new Error("Already logged in."));
      }
    },
    registerUser
  );
  binder.attach(
    {
      endPoint: endPoints.user.current.updateProfile,
      permissions: {
        loggedIn: true
      }
    },
    [
      attachSessionUserId,
      updateProfile
    ]
  );
  binder.attach(
    {
      endPoint: endPoints.user.getFullProfile,
      permissions: {
        user: {
          profile: {
            full: true
          }
        }
      }
    },
    getProfile.getFullProfile
  );
  binder.attach(
    {
      endPoint: endPoints.user.updateProfile,
      customPermissionDenied: validateCurrentUser
    },
    [
      attachParamUserId,
      updateProfile
    ]
  );
  binder.attach(
    {
      endPoint: endPoints.user.updatePermissions,
      permissions: {
        user: {
          permissions: {
            edit: true
          }
        }
      }
    },
    updatePermissions
  );
  binder.attach(
    {
      endPoint: endPoints.user.current.updatePassword,
      validation: validation.validateUpdateUserPassword
    },
    [
      attachSessionUserId,
      updatePassword
    ]
  );
  binder.attach(
    {
      endPoint: endPoints.user.updatePassword,
      permissions: {
        user: {
          profile: {
            edit: true
          }
        }
      },
      validation: validation.validateUpdateUserPassword
    },
    [
      attachParamUserId,
      updatePassword
    ]
  );

  binder.attach(
    {
      endPoint: endPoints.user.emailExists
    },
    binder.makeSimpleController(
      "getIdForEmail",
      {
        parseFunc: function(req: Express.Request) {
          return req.query;
        },
        processResponse: function(response) {
          return {
            isValid: response !== -1
          };
        }
      }
    )
  );
  binder.attach(
    {
      endPoint: endPoints.user.list
    },
    binder.makeSimpleController(
      "getUsersList",
      {}
    )
  );
  binder.attach(
    {
      endPoint: endPoints.user.notes
    },
    binder.makeSimpleController(
      "getNotesForId",
      {
        parseFunc: function(req: Express.Request) {
          var params = {
            id: parseInt(req.param("id"))
          };
          return params;
        }
      }
    )
  );
    binder.attach(
    {
      endPoint: endPoints.user.newNote
    },
    binder.makeSimpleController(
      "newNote",
      {
        parseFunc: function(req: Express.Request) {
          var params: dbQueryStruct.NewNote = {
            targetId: parseInt(req.param("id")),
            message: req.param("message"),
            authorId: req.session.user.id,
            date : new Date()
          };
          return params;
        }
      }
    )
  );
}
