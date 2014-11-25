class Users implements mkuser.Users {

  public id : number;
  public email: string;
  public firstname: string;
  public lastname: string;
  public isMember: string;
  public activeUntil: Date;

  constructor (userRow: any) {
    this.id          = userRow.id;
    this.firstname   = userRow.firstname;
    this.lastname    = userRow.lastname;
    this.email       = userRow.email;
    this.isMember    = userRow.isMember;
    this.activeUntil = userRow.activeUntil;
  }

}
export = Users;
