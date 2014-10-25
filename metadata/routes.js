function addRoutes(metaData) {
    metaData.addRoute({
        idPath: ["public", "myaccount"],
        component: "MyAccountPage",
        name: "My Account",
        path: "myaccount"
    });
    metaData.addRoute({
      idPath: ["public","loginpage"],
      component: "LoginPage",
      name: "Login Page",
      path: "loginpage"
    });
}
exports.addRoutes = addRoutes;
