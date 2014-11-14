import utils = require("mykoop-utils");
export function addRoutes(metaDataBuilder: utils.MetaDataBuilder) {
  /* Public routes. */
  metaDataBuilder.addFrontendRoute({
    idPath: ["public", "myaccount"],
    component: "MyAccountPage",
    name: "myAccount",
    path: "/myaccount"
  });

  metaDataBuilder.addFrontendRoute({
    idPath: ["public", "adminEdit"],
    component: "AdminEditProfile",
    name: "adminEdit",
    path: "/adminEdit"
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
