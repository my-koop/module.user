import metaData = require("../metadata/index");

// Controllers.
import tryLogin = require("./tryLogin");
import getProfile = require("./getProfile");

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
}
