var Users = (function () {
    function Users(userRow) {
        this.id = userRow.id;
        this.firstname = userRow.firstname;
        this.lastname = userRow.lastname;
        this.email = userRow.email;
        this.isMember = userRow.isMember;
        this.activeUntil = userRow.activeUntil;
    }
    return Users;
})();
module.exports = Users;
