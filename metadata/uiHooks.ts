var uiHooks = {
  navbar_main_dashboard: {
    users: {
      type: "item",
      content: {
        icon: "users",
        text: "user::navbar.users",
        link: "users"
      },
      priority: 100,
      permissions: {
        user: {
          profile: {
            view: true
          }
        }
      }
    }
  },
  navbar_secondary: {
    register: {
      type: "item",
      content: {
        icon: "check",
        text: "user::navbar.register",
        link: "register"
      },
      priority: 100,
      permissions: {
        loggedIn: false
      }
    },
    login: {
      type: "custom",
      content: {
        resolve: "component",
        value: "UserLoginNavItem"
      },
      priority: 200,
      permissions: {
        loggedIn: false
      }
    },
    usermenu: {
      type: "item",
      content: {
        icon: "user",
        text: {
          resolve: "lib",
          value: "frontend/getUserEmail"
        },
        children: {
          myaccount: {
            type: "item",
            content: {
              icon: "cog",
              text: "user::navbar.myAccount",
              link: "myAccount"
            },
            priority: 100
          },
          logoutseparator: {
            type: "item",
            priority: 950
          },
          logout: {
            type: "item",
            content: {
              icon: "sign-out",
              text: "user::navbar.logout",
              link: {
                onClick: {
                  resolve: "lib",
                  value: "frontend/logoutUser"
                }
              }
            },
            priority: 1000
          }
        }
      },
      permissions: {
        loggedIn: true
      },
      priority: 300
    }
  },
  sidebar: {
    users: {
      type: "item",
      content: {
        icon: "users",
        text: "user::sidebar.users",
        link: "users"
      },
      priority: 100,
      permissions: {
        user: {
          profile: {
            view: true
          }
        }
      }
    }
  }
};

export = uiHooks;
