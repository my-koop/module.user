// see http://validatejs.org/ for documentation on how to do contraints
var validate = require("mykoop-utils/common/index").validation;
var registerPasswordMatch = function (value, options, key, attributes) {
    if (typeof attributes.password != "undefined" && attributes.password !== attributes.confpassword) {
        return "^notMatch";
    }
};
validate.addValidator("registerPasswordMatch", registerPasswordMatch);
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
        presence: true,
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
var registerConstraint = {
    firstName: {
        presence: {
            message: "^notFound"
        }
    },
    lastName: {
        presence: {
            message: "^notFound"
        }
    },
    email: {
        presence: {
            message: "^notFound"
        },
        email: { message: "^invalid" }
    },
    password: {
        presence: {
            message: "^notFound"
        }
    },
    confpassword: {
        presence: {
            message: "^notFound"
        },
        registerPasswordMatch: ""
    },
    phone: {
        length: {
            maximum: 25,
            message: "^maximumLength"
        }
    },
    referral: {
        inclusion: {
            within: ["visit", "friend", "ads", "other"],
            message: "^invalidSelection"
        }
    },
    usageFrequency: {
        inclusion: {
            within: ["everyday", "fewWeek", "fewMonth", "fewYear", "never"],
            message: "^invalidSelection"
        }
    },
    referralSpecify: {
        length: {
            maximum: 128,
            message: "^maximumLength"
        }
    },
    origin: {
        inclusion: {
            within: ["udem", "brebeuf", "other"],
            message: "^invalidSelection"
        }
    },
    usageNote: {
        length: {
            maximum: 128,
            message: "^maximumLength"
        }
    }
};
function validateRegister(obj) {
    return validate(obj, registerConstraint);
}
exports.validateRegister = validateRegister;
var loginConstraint = {
    email: {
        presence: {
            message: "^notFound"
        },
        email: { message: "^invalid" }
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
