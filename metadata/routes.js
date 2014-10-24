function addRoutes(metaData) {
    metaData.addRoute({
        idPath: ["public", "myaccount"],
        component: "MyAccountPage",
        name: "My Account",
        path: "myaccount"
    });
}
exports.addRoutes = addRoutes;
