import utils = require("mykoop-utils");
export function addRoutes(metaData: utils.MetaData) {
   metaData.addRoute({
    idPath: ["public","myaccount"],
    component: "MyAccountPage",
    name: "My Account",
    path: "/myaccount"
  });
   metaData.addRoute({
    idPath: ["public","loginpage"],
    component: "LoginPage",
    name: "Login Page",
    path: "/loginpage"
  });
}
