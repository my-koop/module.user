
class UserProfile implements mkuser.UserProfile {
  public static COLUMNS = ['email','firstname','lastname','birthdate','phone','origin'];
  public static FORM = [
    {
      "properties": {
        "name": "email",
        "label": "Email",
      },
      "type": "text"
    },
    {
      "properties": {
        "name": "firstname",
        "label": "First Name",
      },
      "type": "text"
    },
    {
      "properties": {
        "name": "lastname",
        "label": "Lastname",
      },
      "type": "text"
    },
    {
      "properties": {
        "name": "birthdate",
        "label": "Birthdate",
      },
      "type": "text"
    },
    {
      "properties": {
        "name": "phone",
        "label": "Phone",
      },
      "type": "text"
    },
    {
      "properties": {
        "name": "origin",
        "label": "Origin",
      },
      "type": "text"
    }
  ];

  public email    : string;
  public firstname: string;
  public lastname : string;
  public birthdate: string;
  public phone    : string;
  public origin   : string;

  constructor (userRow: any) {
    this.email     = userRow.email,
    this.firstname = userRow.firstname,
    this.lastname  = userRow.lastname,
    this.birthdate = userRow.birthdate,
    this.phone     = userRow.phone,
    this.origin    = userRow.origin
  }

}
export = UserProfile;
