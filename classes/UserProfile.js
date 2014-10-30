var UserProfile = (function () {
    function UserProfile(userRow) {
        this.email = userRow.email, this.firstname = userRow.firstname, this.lastname = userRow.lastname, this.birthdate = userRow.birthdate, this.phone = userRow.phone, this.origin = userRow.origin;
    }
    UserProfile.COLUMNS = ["email", "firstname", "lastname", "birthdate", "phone", "origin"];
    return UserProfile;
})();
module.exports = UserProfile;
