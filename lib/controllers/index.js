var endPoints = require("../../metadata/endpoints");
var validation = require("../validation/index");

var assert = require("assert");

// Assertions
assert.equal(endPoints.user.emailExists.method, "get");

// Controllers.
var login = require("./login");
var getProfile = require("./getProfile");
var registerUser = require("./registerUser");
var updateProfile = require("./updateProfile");
var updatePassword = require("./updatePassword");

function attachControllers(binder) {
    binder.attach({ endPoint: endPoints.user.login }, login);
    binder.attach({ endPoint: endPoints.user.getProfile }, getProfile);
    binder.attach({ endPoint: endPoints.user.register }, registerUser);
    binder.attach({ endPoint: endPoints.user.updateProfile }, updateProfile);
    binder.attach({
        endPoint: endPoints.user.updatePassword,
        validation: validation.validateUpdatePassword
    }, updatePassword);
    binder.attach({
        endPoint: endPoints.user.emailExists
    }, binder.makeSimpleController("checkEmailExists", function (req) {
        return req.query;
    }));
}
exports.attachControllers = attachControllers;
