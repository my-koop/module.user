var endPoints = require("../../metadata/endpoints");
var validation = require("../validation/index");
var assert = require("assert");
// Assertions
assert.equal(endPoints.user.emailExists.method, "get");
// Helper controllers.
var attachSessionUserId = require("./attachSessionUserId");
var attachParamUserId = require("./attachParamUserId");
var validateCurrentUser = require("./validateCurrentUser");
// Controllers.
var login = require("./login");
var logout = require("./logout");
var getProfile = require("./getProfile");
var getSession = require("./getSession");
var registerUser = require("./registerUser");
var updateProfile = require("./updateProfile");
var updatePassword = require("./updatePassword");
var resetPassword = require("./resetPassword");
var updatePermissions = require("./updatePermissions");
function attachControllers(binder) {
    var user = binder.moduleInstance;
    binder.attach({
        endPoint: endPoints.user.login,
        customPermissionGranted: function (req, callback) {
            callback(req.session.user && new Error("Already logged in."));
        }
    }, login);
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
    binder.attach({
        endPoint: endPoints.user.getPublicProfile,
        permissions: {
            user: {
                profile: {
                    full: true
                }
            }
        },
        customPermissionDenied: validateCurrentUser
    }, getProfile.getPublicProfile);
    binder.attach({
        endPoint: endPoints.user.register,
        // TODO:: Validation
        customPermissionGranted: function (req, callback) {
            callback(req.session.user && new Error("Already logged in."));
        }
    }, registerUser);
    binder.attach({
        endPoint: endPoints.user.current.updateProfile,
        permissions: {
            loggedIn: true
        }
    }, [
        attachSessionUserId,
        updateProfile
    ]);
    binder.attach({
        endPoint: endPoints.user.getFullProfile,
        permissions: {
            user: {
                profile: {
                    full: true
                }
            }
        }
    }, getProfile.getFullProfile);
    binder.attach({
        endPoint: endPoints.user.updateProfile,
        customPermissionDenied: validateCurrentUser
    }, [
        attachParamUserId,
        updateProfile
    ]);
    binder.attach({
        endPoint: endPoints.user.updatePermissions,
        permissions: {
            user: {
                permissions: {
                    edit: true
                }
            }
        }
    }, updatePermissions);
    binder.attach({
        endPoint: endPoints.user.current.updatePassword,
        validation: validation.validateUpdateUserPassword
    }, [
        attachSessionUserId,
        updatePassword
    ]);
    binder.attach({
        endPoint: endPoints.user.updatePassword,
        permissions: {
            user: {
                profile: {
                    edit: true
                }
            }
        },
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
    binder.attach({ endPoint: endPoints.user.resetPassword }, resetPassword);
    binder.attach({
        endPoint: endPoints.user.list
    }, binder.makeSimpleController("getUsersList", {}));
    binder.attach({
        endPoint: endPoints.user.notes.list
    }, binder.makeSimpleController("getNotesForId", {
        parseFunc: function (req) {
            var params = {
                id: parseInt(req.param("id"))
            };
            return params;
        }
    }));
    binder.attach({
        endPoint: endPoints.user.notes.new
    }, binder.makeSimpleController("newNote", {
        parseFunc: function (req) {
            var params = {
                targetId: parseInt(req.param("id")),
                message: req.param("message"),
                authorId: req.session.user.id,
            };
            return params;
        }
    }));
    binder.attach({
        endPoint: endPoints.user.activation
    }, binder.makeSimpleController(user.userActivation, function (req) {
        return {
            id: parseInt(req.param("id")),
            activate: parseInt(req.param("activate"))
        };
    }));
}
exports.attachControllers = attachControllers;
