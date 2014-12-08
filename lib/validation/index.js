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
//FIXME: Validate birthdate
var updateProfileContraint = {
    email: {
        presence: {
            message: "^email:validationEmailPresence"
        },
        email: {
            message: "^email:validationEmailValid"
        }
    },
    firstname: {
        presence: {
            message: "^firstname:validationFirstnamePresence"
        }
    },
    lastname: {
        presence: {
            message: "^lastname:validationLastnamePresence"
        },
    },
    phone: {
        length: {
            maximum: 25,
            message: "^phone:validationPhoneLength"
        }
    },
    referral: {
        inclusion: {
            within: ["visit", "friend", "ads", "other"],
            message: "^referral:validationReferralValue"
        }
    },
    usageFrequency: {
        inclusion: {
            within: ["everyday", "fewWeek", "fewMonth", "fewYear", "never"],
            message: "^usageFrequency:validationUsageFrequencyValue"
        }
    },
    referralSpecify: {
        length: {
            maximum: 128,
            message: "^referralSpecify:validationReferralSpecifyLength"
        }
    },
    origin: {
        inclusion: {
            within: ["udem", "brebeuf", "other"],
            message: "^origin:validationOriginValue"
        }
    },
    usageNote: {
        length: {
            maximum: 128,
            message: "^usageNote:validationUsageNoteLength"
        }
    },
};
function validateUpdateProfile(obj) {
    return validate(obj, updateProfileContraint, { flatten: true });
}
exports.validateUpdateProfile = validateUpdateProfile;
