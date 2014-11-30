var uiHooks = {
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
                    value: "common/getUserEmail"
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
                        type: "custom",
                        content: {
                            resolve: "component",
                            value: "UserLogoutMenuItem"
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
    }
};
module.exports = uiHooks;
