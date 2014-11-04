var metaData = require("../metadata/index");

// Controllers.
var tryLogin = require("./tryLogin");
var getProfile = require("./getProfile");
var registerUser = require("./registerUser");
var updateProfile = require("./updateProfile");

var endPoints = metaData.endpoints;

function attachControllers(userModuleControllers) {
    userModuleControllers.attach({ endPoint: endPoints.user.tryLogin }, tryLogin);
    userModuleControllers.attach({ endPoint: endPoints.user.getProfile }, getProfile);
    userModuleControllers.attach({ endPoint: endPoints.user.register }, registerUser);
    userModuleControllers.attach({ endPoint: endPoints.user.updateProfile }, updateProfile);
}
exports.attachControllers = attachControllers;
