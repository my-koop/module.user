var validate = require("mykoop-utils/common").validation;

validate.validators.passwordsMatch = function (value, options, key, attributes) {
    if (value !== attributes.newPassword) {
        return "New passwords must match";
    } else {
        return null;
    }
};

var updatePasswordConstraint = {
    id: {
        presence: true,
        onlyInteger: true,
        greaterThan: 0
    },
    oldPassword: {
        presence: true
    },
    newPassword: {
        presence: true
    },
    confNewPassword: {
        presence: true,
        passwordsMatch: ""
    }
};

function validateUpdatePassword(obj) {
    return validate(obj, updatePasswordConstraint);
}
exports.validateUpdatePassword = validateUpdatePassword;
