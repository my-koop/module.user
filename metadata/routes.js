function addRoutes(metaDataBuilder) {
    /* Public routes. */
    metaDataBuilder.addFrontendRoute({
        idPath: ["public", "myaccount"],
        component: "MyAccountPage",
        name: "myAccount",
        path: "/myaccount"
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
exports.addRoutes = addRoutes;
