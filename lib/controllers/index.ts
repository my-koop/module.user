import endPoints = require("../../metadata/endpoints");
import validation = require("../validation/index");
import utils = require("mykoop-utils");
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
  binder.attach({
      endPoint: endPoints.user.updatePassword,
      validation: validation.validateUpdatePassword
    },
    updatePassword
  )
  binder.attach(
    {
      endPoint: endPoints.user.emailExists
    },
    binder.makeSimpleController("checkEmailExists", function(req) {
      return req.query;
    })
  )
}
