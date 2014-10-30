var UserProfile = (function () {
    function UserProfile(userRow) {
        this.email = userRow.email, this.firstname = userRow.firstname, this.lastname = userRow.lastname, this.birthdate = userRow.birthdate, this.phone = userRow.phone, this.origin = userRow.origin, this.referral = userRow.referral, this.usageFrequency = userRow.usageFrequency, this.usageNote = userRow.usageNote;
    }
    UserProfile.COLUMNS = [
        "email",
        "firstname",
        "lastname",
        "birthdate",
        "phone",
        "origin",
        "referral",
        "usageFrequency",
        "usageNote"
    ];
    return UserProfile;
})();
module.exports = UserProfile;
