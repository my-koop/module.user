import utils = require("mykoop-utils");
export function addRoutes(metaData: utils.MetaData) {
   metaData.addRoute({
    idPath: ["public","myaccount"],
    component: "MyAccountPage",
    name: "My Account",
    path: "myaccount"
  });
}
