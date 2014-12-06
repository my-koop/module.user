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

}

export function validateUpdateUserPassword(obj) {
  //FIX ME: Validating new passwords match until custom validator can be used
  if(typeof obj.newPassword != "undefined" && obj.newPassword !== obj.confNewPassword){
    return {
      confNewPassword: "New passwords must match"
    }
  }
  if(typeof obj.oldPassword != "undefined" && obj.oldPassword === obj.newPassword){
    return {
      newPassword: "New password must be different from current password"
    }
  }

  return validate(obj, updatePasswordConstraint);
}

//FIXME: Validate birthdate
var updateProfileContraint = {
  email: {
    presence: true
  },
  firstname: {
    presence: true
  },
  lastname: {
    presence: true
  },
  phone: {
    length: {
      maximum: 25,
      message: "^validation_phone_length"
    }
  },
  origin: {
    inclusion : {
      within: ["udem", "brebeuf", "other"],
      message: "^validation_origin_value"
    }
  },
  usageNote: {
    length: {
      maximum: 128,
      message: "^validation_usageNote_length"
    }
  },
  usageFrequency: {
    inclusion : {
      within: ["everyday", "fewWeek", "fewMonth", "fewYear", "never"],
      message: "^validation_usageFrequency_value"
    }
  },
  referral: {
    inclusion : {
      within: ["visit", "friend", "ads", "other"],
      message: "^validation_referral_value"
    }
  },
  referralSpecify: {
    length: {
      maximum: 128,
      message: "^validation_referralSpecify_length"
    }
  },
}

export function validateUpdateProfile(obj) {
  return validate(obj, updateProfileContraint);

}
