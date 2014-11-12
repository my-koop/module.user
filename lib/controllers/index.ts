import endPoints = require("../../metadata/endpoints");
import validation = require("../validation/index");
import utils = require("mykoop-utils");
import Express = require("express");
import assert = require("assert");
// Assertions
assert.equal(endPoints.user.emailExists.method, "get");

// Controllers.
import login = require("./login");
import getProfile = require("./getProfile");
import registerUser = require("./registerUser");
import updateProfile = require("./updateProfile");
import updatePassword = require("./updatePassword");

export function attachControllers(
  binder: utils.ModuleControllersBinder<mkuser.Module>
) {
  binder.attach(
    {endPoint: endPoints.user.login},
    login
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
    {endPoint: endPoints.user.updateProfile},
    updateProfile
  );
  binder.attach(
    {
      endPoint: endPoints.user.updateCurrentUserPassword,
      validation: validation.validateUpdatePassword
    },
    [
      function (req, res, next) {
        res.locals.userId = req.session.user.id
        next();
      },
      updatePassword
    ]
  );
  binder.attach(
    {
      endPoint: endPoints.user.updateUserPassword,
      validation: validation.validateUpdatePassword
    },
    [
      function (req, res, next) {
        res.locals.userId = req.param("id");
        next();
      },
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
}
