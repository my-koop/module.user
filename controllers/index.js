var metaData = require("../metadata/index");

// Controllers.
var tryLogin = require("./tryLogin");
var getSaltWithEmail = require("./getSaltWithEmail");
var getSaltWithId = require("./getSaltWithId");
var getProfile = require("./getProfile");
var testEmailUnique = require("./testEmailUnique");

var endPoints = metaData.endpoints;

function attachControllers(userModuleControllers) {
    userModuleControllers.attach({ endPoint: endPoints.user.tryLogin }, tryLogin);
    userModuleControllers.attach({ endPoint: endPoints.user.getSaltWithEmail }, getSaltWithEmail);
    userModuleControllers.attach({ endPoint: endPoints.user.getSaltWithId }, getSaltWithId);
    userModuleControllers.attach({ endPoint: endPoints.user.getProfile }, getProfile);
    userModuleControllers.attach({ endPoint: endPoints.user.testEmailUnique }, testEmailUnique);
}
exports.attachControllers = attachControllers;
