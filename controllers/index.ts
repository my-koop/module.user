import metaData = require("../metadata/index");
import validation = require("../lib/validation/index");

// Controllers.
import tryLogin = require("./tryLogin");
import getProfile = require("./getProfile");
import registerUser = require("./registerUser");
import updateProfile = require("./updateProfile");
import updatePassword = require("./updatePassword");

var endPoints = metaData.endpoints;

export function attachControllers(userModuleControllers) {
  userModuleControllers.attach(
    {endPoint: endPoints.user.tryLogin},
    tryLogin
  );
  userModuleControllers.attach(
    {endPoint: endPoints.user.getProfile},
    getProfile
  );
  userModuleControllers.attach(
    {endPoint: endPoints.user.register},
    registerUser
  );
  userModuleControllers.attach(
    {endPoint: endPoints.user.updateProfile},
    updateProfile
  );
  userModuleControllers.attach({
      endPoint: endPoints.user.updatePassword,
      validation: validation.validateUpdatePassword
    },
    updatePassword
  )
}
