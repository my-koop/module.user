
class UserProfile implements mkuser.UserProfile {
  public static COLUMNS = [
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

  public email          : string;
  public firstname      : string;
  public lastname       : string;
  public birthdate      : string;
  public phone          : string;
  public origin         : string;
  public referral       : string;
  public referralSpecify: string;
  public usageFrequency : string;
  public usageNote      : string;
  public permissions    : any;
  public deactivated    : number;

  constructor (userRow: any) {
    this.email           = userRow.email;
    this.firstname       = userRow.firstname;
    this.lastname        = userRow.lastname;
    this.birthdate       = userRow.birthdate;
    this.phone           = userRow.phone;
    this.origin          = userRow.origin;
    this.referral        = userRow.referral;
    this.referralSpecify = userRow.referralSpecify;
    this.usageFrequency  = userRow.usageFrequency;
    this.usageNote       = userRow.usageNote;
    this.permissions     = userRow.perms;
    this.deactivated     = userRow.deactivated;
  }

}
export = UserProfile;
