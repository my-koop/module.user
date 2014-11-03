
class UserProfile implements mkuser.UserProfile {
  public static COLUMNS = [
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

  public email          : string;
  public firstname      : string;
  public lastname       : string;
  public birthdate      : string;
  public phone          : string;
  public origin         : string;
  public referral       : string;
  public usageFrequency : string;
  public usageNote      : string;

  constructor (userRow: any) {
    this.email          = userRow.email,
    this.firstname      = userRow.firstname,
    this.lastname       = userRow.lastname,
    this.birthdate      = userRow.birthdate,
    this.phone          = userRow.phone,
    this.origin         = userRow.origin,
    this.referral       = userRow.referral,
    this.usageFrequency = userRow.usageFrequency,
    this.usageNote      = userRow.usageNote
  }

}
export = UserProfile;
