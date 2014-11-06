import metaData = require("../metadata/index");

// Controllers.
import login = require("./login");
import getProfile = require("./getProfile");
import registerUser = require("./registerUser");
import updateProfile = require("./updateProfile");

var endPoints = metaData.endpoints;

export function attachControllers(userModuleControllers) {
  userModuleControllers.attach(
    {endPoint: endPoints.user.login},
    login
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
}
