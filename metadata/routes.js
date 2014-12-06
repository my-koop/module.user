function addRoutes(metaDataBuilder) {
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
        path: "myaccount",
        permissions: {
            loggedIn: true
        },
    });
    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard", "adminEdit"],
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
    metaDataBuilder.addFrontendRoute({
        idPath: ["simple", "passwordrecovery"],
        component: "PasswordRecoveryPage",
        name: "passwordrecovery",
        path: "passwordrecovery"
    });
}
exports.addRoutes = addRoutes;
