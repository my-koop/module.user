import metaData = require("../metadata/index");

// Controllers.
var tryLogin = require("./tryLogin");

var endPoints = metaData.endpoints;

export function attachControllers(userModuleControllers) {
  userModuleControllers.attach(
    {endPoint: endPoints.user.tryLogin},
    tryLogin,
  );
}
