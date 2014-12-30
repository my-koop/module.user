import utils = require("mykoop-utils");
export function addRoutes(metaDataBuilder: utils.MetaDataBuilder) {
  /* Public routes. */
  metaDataBuilder.addFrontendRoute({
    idPath: ["public", "accessDenied"],
    i18nKey: "user::denied",
    component: "AccessDeniedPage",
    name: "denied",
    path: "denied"
  });

  metaDataBuilder.addFrontendRoute({
    idPath: ["public", "myaccount"],
    i18nKey: "user::navbar.myAccount",
    component: "MyAccountPage",
    name: "myAccount",
    path: "myaccount",
    permissions: {
      loggedIn: true
    },
  });

  metaDataBuilder.addFrontendRoute({
    idPath: ["dashboard", "adminEdit"],
    i18nKey: "user::adminEdit",
    component: "AdminEditProfile",
    name: "adminEdit",
    path: "user/:id",
    permissions: {
      user: {
        profile: {
          edit: true
        }
      }
    },
    // For tests
    params: {
      id: [
        "2",
        "161"
      ]
    }
  });

  metaDataBuilder.addFrontendRoute({
    idPath: ["dashboard", "users"],
    i18nKey: "user::navbar.users",
    component: "Users",
    name: "users",
    path: "users",
    permissions: {
      user: {
        profile: {
          view: true
        }
      }
    }
  });

  /* Simple routes. */
  metaDataBuilder.addFrontendRoute({
    idPath: ["simple", "login"],
    i18nKey: "user::navbar.login",
    component: "LoginPage",
    name: "login",
    path: "login",
    permissions: {
      loggedIn: false
    }
  });

  metaDataBuilder.addFrontendRoute({
    idPath: ["simple", "register"],
    i18nKey: "user::navbar.register",
    component: "RegisterPage",
    name: "register",
    path: "register",
    permissions: {
      loggedIn: false
    }
  });

  metaDataBuilder.addFrontendRoute({
    idPath: ["simple", "passwordrecovery"],
    i18nKey: "user::passwordRecoveryWelcome",
    component: "PasswordRecoveryPage",
    name: "passwordrecovery",
    path: "passwordrecovery",
    permissions: {
      loggedIn: false
    }
  });
}
