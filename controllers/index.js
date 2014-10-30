var metaData = require("../metadata/index");

// Controllers.
var tryLogin = require("./tryLogin");
var getProfile = require("./getProfile");

var endPoints = metaData.endpoints;

function attachControllers(userModuleControllers) {
    userModuleControllers.attach({ endPoint: endPoints.user.tryLogin }, tryLogin);
    userModuleControllers.attach({ endPoint: endPoints.user.getProfile }, getProfile);
}
exports.attachControllers = attachControllers;
