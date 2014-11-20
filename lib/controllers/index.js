var endPoints = require("../../metadata/endpoints");
var validation = require("../validation/index");
var assert = require("assert");
// Assertions
assert.equal(endPoints.user.emailExists.method, "get");
// Helper controllers.
var attachSessionUserId = require("./attachSessionUserId");
var attachParamUserId = require("./attachParamUserId");
// Controllers.
var login = require("./login");
var logout = require("./logout");
var getProfile = require("./getProfile");
var getSession = require("./getSession");
var registerUser = require("./registerUser");
var updateProfile = require("./updateProfile");
var updatePassword = require("./updatePassword");
var passwordRecovery = require("./passwordRecovery");
function attachControllers(binder) {
    binder.attach({ endPoint: endPoints.user.login }, login);
    binder.attach({ endPoint: endPoints.user.current.getSession }, getSession);
    binder.attach({ endPoint: endPoints.user.current.logout }, logout);
    binder.attach({
        endPoint: endPoints.user.exists
    }, binder.makeSimpleController("userExists", function (req) {
        var params = {
            id: parseInt(req.param("id")) || 0
        };
        return params;
    }));
    binder.attach({ endPoint: endPoints.user.getProfile }, getProfile);
    binder.attach({ endPoint: endPoints.user.register }, registerUser);
    binder.attach({ endPoint: endPoints.user.current.updateProfile }, [
        attachSessionUserId,
        updateProfile
    ]);
    binder.attach({ endPoint: endPoints.user.updateProfile }, [
        attachParamUserId,
        updateProfile
    ]);
    binder.attach({
        endPoint: endPoints.user.current.updatePassword,
        validation: validation.validateUpdateUserPassword
    }, [
        attachSessionUserId,
        updatePassword
    ]);
    binder.attach({
        endPoint: endPoints.user.updatePassword,
        validation: validation.validateUpdateUserPassword
    }, [
        attachParamUserId,
        updatePassword
    ]);
    binder.attach({
        endPoint: endPoints.user.emailExists
    }, binder.makeSimpleController("getIdForEmail", {
        parseFunc: function (req) {
            return req.query;
        },
        processResponse: function (response) {
            return {
                isValid: response !== -1
            };
        }
    }));
    binder.attach({ endPoint: endPoints.user.passwordRecovery }, passwordRecovery);
}
exports.attachControllers = attachControllers;
