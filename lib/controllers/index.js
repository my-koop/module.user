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
var resetPassword = require("./resetPassword");
var updatePermissions = require("./updatePermissions");
function attachControllers(binder) {
    var user = binder.moduleInstance;
    var validateCurrentUser = user.constructor.validateCurrentUser;
    binder.attach({
        endPoint: endPoints.user.login,
        validation: validation.validateLogin,
        customPermissionGranted: function (req, callback) {
            callback(req.session.user && new Error("Already logged in."));
        }
    }, login);
    binder.attach({ endPoint: endPoints.user.current.getSession }, getSession);
    binder.attach({
        endPoint: endPoints.user.current.logout,
        permissions: {
            loggedIn: true
        }
    }, logout);
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
                    view: true
                }
            }
        },
        customPermissionDenied: validateCurrentUser
    }, getProfile.getPublicProfile);
    binder.attach({
        endPoint: endPoints.user.register,
        validation: validation.validateRegister,
        customPermissionGranted: function (req, callback) {
            callback(req.session.user && new Error("Already logged in."));
        }
    }, registerUser);
    binder.attach({
        endPoint: endPoints.user.current.updateProfile,
        validation: validation.validateUpdateProfile,
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
                    view: true
                }
            }
        }
    }, getProfile.getFullProfile);
    binder.attach({
        endPoint: endPoints.user.updateProfile,
        validation: validation.validateUpdateProfile,
        permissions: {
            user: {
                profile: {
                    edit: true
                }
            }
        },
        customPermissionDenied: validateCurrentUser
    }, [
        attachParamUserId,
        updateProfile
    ]);
    binder.attach({
        endPoint: endPoints.user.updatePermissions,
        permissions: {
            user: {
                profile: {
                    permissions: {
                        edit: true
                    }
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
                    password: true
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
        endPoint: endPoints.user.list,
        permissions: {
            user: {
                profile: {
                    view: true
                }
            }
        }
    }, binder.makeSimpleController("getUsersList", {}));
    binder.attach({
        endPoint: endPoints.user.notes.list,
        permissions: {
            user: {
                notes: {
                    view: true
                }
            }
        }
    }, binder.makeSimpleController("getNotesForId", {
        parseFunc: function (req) {
            var params = {
                id: parseInt(req.param("id"))
            };
            return params;
        }
    }));
    binder.attach({
        endPoint: endPoints.user.notes.new,
        permissions: {
            user: {
                notes: {
                    edit: true
                }
            }
        }
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
        endPoint: endPoints.user.activation,
        permissions: {
            user: {
                activation: true
            }
        }
    }, binder.makeSimpleController(user.userActivation, function (req) {
        return {
            id: parseInt(req.param("id")) || 0,
            activate: parseInt(req.param("activate")) || 0
        };
    }));
}
exports.attachControllers = attachControllers;
