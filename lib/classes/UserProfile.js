var UserProfile = (function () {
    function UserProfile(userRow) {
        this.email = userRow.email;
        this.firstname = userRow.firstname;
        this.lastname = userRow.lastname;
        this.birthdate = userRow.birthdate;
        this.phone = userRow.phone;
        this.origin = userRow.origin;
        this.referral = userRow.referral;
        this.referralSpecify = userRow.referralSpecify;
        this.usageFrequency = userRow.usageFrequency;
        this.usageNote = userRow.usageNote;
        this.permissions = userRow.perms;
        this.deactivated = userRow.deactivated;
    }
    UserProfile.COLUMNS = [
        "email",
        "firstname",
        "lastname",
        "birthdate",
        "phone",
        "origin",
        "referral",
        "referralSpecify",
        "usageFrequency",
        "usageNote",
        "perms",
        "deactivated"
    ];
    return UserProfile;
})();
module.exports = UserProfile;
