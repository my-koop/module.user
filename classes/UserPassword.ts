class UserPassword {
  public static FORM = [
    {
      "properties": {
        "name": "currpassword",
        "label": "Current Password",
      },
      "type": "password"
    },
    {
      "properties": {
        "name": "newpassword",
        "label": "New Password",
      },
      "type": "password"
    },
    {
      "properties": {
        "name": "conf_newpassword",
        "label": "Confirm New Password",
      },
      "type": "password"
    }
  ];

}
export = UserPassword;