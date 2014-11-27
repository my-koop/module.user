import utils = require("mykoop-utils");
export function addRoutes(metaDataBuilder: utils.MetaDataBuilder) {
  /* Public routes. */
  metaDataBuilder.addFrontendRoute({
    idPath: ["public", "accessDenied"],
    component: "AccessDeniedPage",
    name: "denied",
    path: "denied"
  });

  metaDataBuilder.addFrontendRoute({
    idPath: ["public", "myaccount"],
    component: "MyAccountPage",
    name: "myAccount",
    path: "myaccount"
  });

  metaDataBuilder.addFrontendRoute({
    idPath: ["dashboard", "adminEdit"],
    component: "AdminEditProfile",
    name: "adminEdit",
    path: "user/:id",
    permissions: {
      user: {
        edit: true
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
    component: "Users",
    name: "users",
    path: "users",
  });

  /* Simple routes. */
  metaDataBuilder.addFrontendRoute({
    idPath: ["simple", "login"],
    component: "LoginPage",
    name: "login",
    path: "login"
  });

  metaDataBuilder.addFrontendRoute({
    idPath: ["simple", "register"],
    component: "RegisterPage",
    name: "register",
    path: "register"
  });
}
