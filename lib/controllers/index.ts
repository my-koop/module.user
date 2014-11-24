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

// Controllers.
import login = require("./login");
import logout = require("./logout");
import getProfile = require("./getProfile");
import getSession = require("./getSession");
import registerUser = require("./registerUser");
import updateProfile = require("./updateProfile");
import updatePassword = require("./updatePassword");
import resetPassword = require("./resetPassword");

export function attachControllers(
  binder: utils.ModuleControllersBinder<mkuser.Module>
) {
  binder.attach(
    {endPoint: endPoints.user.login},
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
    {endPoint: endPoints.user.getProfile},
    getProfile
  );
  binder.attach(
    {endPoint: endPoints.user.register},
    registerUser
  );
  binder.attach(
    {endPoint: endPoints.user.current.updateProfile},
    [
      attachSessionUserId,
      updateProfile
    ]
  );
  binder.attach(
    {endPoint: endPoints.user.updateProfile},
    [
      attachParamUserId,
      updateProfile
    ]
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
    {endPoint: endPoints.user.resetPassword},
    resetPassword
  );
}
