
class UserProfile {
  public static COLUMNS = ['email','firstname','lastname','birthdate','phone','origin'];
  public email    : string;
  public firstname: string;
  public lastname : string;
  public birthdate: string;
  public phone    : string;
  public origin   : string;
  public static FORM = [
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
      "type": "firstname"
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

  constructor (userRow: any) {
    this.email     = userRow['email'],
    this.firstname = userRow['firstname'],
    this.lastname  = userRow['lastname'],
    this.birthdate = userRow['birthdate'],
    this.phone     = userRow['phone'],
    this.origin    = userRow['origin']
  }

}
export = UserProfile;
