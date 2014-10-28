var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var UserProfile = (function (_super) {
    __extends(UserProfile, _super);
    function UserProfile(userRow) {
        _super.call(this);
        this.email = userRow.email, this.firstname = userRow.firstname, this.lastname = userRow.lastname, this.birthdate = userRow.birthdate, this.phone = userRow.phone, this.origin = userRow.origin;
    }
    UserProfile.COLUMNS = ['email', 'firstname', 'lastname', 'birthdate', 'phone', 'origin'];
    UserProfile.FORM = [
        {
            "properties": {
                "name": "email",
                "label": "Email"
            },
            "type": "text"
        },
        {
            "properties": {
                "name": "firstname",
                "label": "First Name"
            },
            "type": "text"
        },
        {
            "properties": {
                "name": "lastname",
                "label": "Lastname"
            },
            "type": "text"
        },
        {
            "properties": {
                "name": "birthdate",
                "label": "Birthdate"
            },
            "type": "text"
        },
        {
            "properties": {
                "name": "phone",
                "label": "Phone"
            },
            "type": "text"
        },
        {
            "properties": {
                "name": "origin",
                "label": "Origin"
            },
            "type": "text"
        }
    ];
    return UserProfile;
})(mkuser.UserProfile);
module.exports = UserProfile;
