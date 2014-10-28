import metaData = require("../metadata/index");

// Controllers.
import tryLogin = require("./tryLogin");
import getSaltWithEmail = require("./getSaltWithEmail");
import getSaltWithId = require("./getSaltWithId");
import getProfile = require("./getProfile");
import testEmailUnique = require("./testEmailUnique");

var endPoints = metaData.endpoints;

export function attachControllers(userModuleControllers) {
  userModuleControllers.attach(
    {endPoint: endPoints.user.tryLogin},
    tryLogin
  );
  userModuleControllers.attach(
    {endPoint: endPoints.user.getSaltWithEmail},
    getSaltWithEmail
  );
  userModuleControllers.attach(
    {endPoint: endPoints.user.getSaltWithId},
    getSaltWithId
  );
  userModuleControllers.attach(
    {endPoint: endPoints.user.getProfile},
    getProfile
  );
  userModuleControllers.attach(
    {endPoint: endPoints.user.testEmailUnique},
    testEmailUnique
  );
}
