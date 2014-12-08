var contributions = {
  user: {
    myAccount: {
      password: {
        component: {
          resolve: "component",
          value: "PasswordChangeForm"
        },
        titleKey: "user::myaccount_tab_password",
        hash: "password",
        priority: 200
      }
    },
    profileEdit: {
      password: {
        component: {
          resolve: "component",
          value: "PasswordChangeForm"
        },
        titleKey: "user::myaccount_tab_password",
        hash: "password",
        priority: 200,
        permissions: {
          user: {
            profile: {
              password: true
            }
          }
        }
      },
      permissions: {
        component: {
          resolve: "component",
          value: "ProfilePermissionsUpdateForm"
        },
        titleKey: "user::useredit_tab_permissions",
        hash: "permissions",
        priority: 300,
        permissions: {
          user: {
            profile: {
              permissions: {
                view: true
              }
            }
          }
        }
      },
      notes: {
        component: {
          resolve: "component",
          value: "Notes"
        },
        titleKey: "user::useredit_tab_notes",
        hash: "notes",
        priority: 400,
        permissions: {
          user: {
            profile: {
              notes: {
                view: true
              }
            }
          }
        }
      }
    }
  }
};

export = contributions;
