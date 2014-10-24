var UserProfile = (function () {
    function UserProfile(userRow) {
        this.email = userRow.email, this.firstname = userRow.firstname, this.lastname = userRow.lastname, this.birthdate = userRow.birthdate, this.phone = userRow.phone, this.origin = userRow.origin;
    }
    UserProfile.COLUMNS = ['email', 'firstname', 'lastname', 'birthdate', 'phone', 'origin'];

    UserProfile.FORM = [
        {
            "properties": {
                "name": "email",
                "label": "Email",
                "valueLink": true
            },
            "type": "text"
        },
        {
            "properties": {
                "name": "firstname",
                "label": "First Name",
                "valueLink": true
            },
            "type": "text"
        },
        {
            "properties": {
                "name": "lastname",
                "label": "Lastname",
                "valueLink": true
            },
            "type": "text"
        },
        {
            "properties": {
                "name": "birthdate",
                "label": "Birthdate",
                "valueLink": true
            },
            "type": "text"
        },
        {
            "properties": {
                "name": "phone",
                "label": "Phone",
                "valueLink": true
            },
            "type": "text"
        },
        {
            "properties": {
                "name": "origin",
                "label": "Origin",
                "valueLink": true
            },
            "type": "text"
        }
    ];
    return UserProfile;
})();
module.exports = UserProfile;
