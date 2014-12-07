var validate = require("mykoop-utils/common/index").validation;
//FIX ME : Commented until we can handle custom validators
// validate.validators.passwordsMatch = function (value, options, key, attributes){
//   if(value !== attributes.newPassword){
//     return "New passwords must match";
//   } else {
//     return null;
//   }
// }
var updatePasswordConstraint = {
    id: {
        numericality: {
            onlyInteger: true,
            greaterThan: 0
        }
    },
    oldPassword: {
        presence: true
    },
    newPassword: {
        presence: true
    },
    confNewPassword: {
        presence: true
    },
};
function validateUpdateUserPassword(obj) {
    //FIX ME: Validating new passwords match until custom validator can be used
    if (typeof obj.newPassword != "undefined" && obj.newPassword !== obj.confNewPassword) {
        return {
            confNewPassword: "New passwords must match"
        };
    }
    if (typeof obj.oldPassword != "undefined" && obj.oldPassword === obj.newPassword) {
        return {
            newPassword: "New password must be different from current password"
        };
    }
    return validate(obj, updatePasswordConstraint);
}
exports.validateUpdateUserPassword = validateUpdateUserPassword;
var loginConstraint = {
    email: {
        presence: {
            message: "^notFound"
        }
    },
    password: {
        presence: {
            message: "^notFound"
        }
    }
};
function validateLogin(obj) {
    return validate(obj, loginConstraint);
}
exports.validateLogin = validateLogin;
