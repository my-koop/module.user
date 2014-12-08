var endpoints = {
    user: {
        current: {
            getSession: {
                path: "/users/current/session",
                method: "get"
            },
            logout: {
                path: "/users/current/logout",
                method: "get"
            },
            updatePassword: {
                path: "/users/current/password",
                method: "put",
                validation: {
                    resolve: "validation",
                    value: "validateUpdateUserPassword"
                }
            },
            updateProfile: {
                path: "/users/current",
                method: "put",
                validation: {
                    resolve: "validation",
                    value: "validateUpdateProfile"
                }
            }
        },
        activation: {
            path: "/users/:id/activation",
            method: "put"
        },
        updatePassword: {
            path: "/users/:id/password",
            method: "put",
            validation: {
                resolve: "validation",
                value: "validateUpdateUserPassword"
            }
        },
        updateProfile: {
            path: "/users/:id",
            method: "put",
            validation: {
                resolve: "validation",
                value: "validateUpdateProfile"
            }
        },
        updatePermissions: {
            path: "/users/:id/permissions",
            method: "put"
        },
        login: {
            path: "/users/login",
            method: "post",
            validation: {
                resolve: "validation",
                value: "validateLogin"
            }
        },
        getPublicProfile: {
            path: "/users/:id",
            method: "get"
        },
        getFullProfile: {
            path: "/users/:id/full",
            method: "get"
        },
        exists: {
            path: "/users/:id/exists",
            method: "get"
        },
        register: {
            path: "/users",
            method: "post",
            validation: {
                resolve: "validation",
                value: "validateRegister"
            }
        },
        emailExists: {
            path: "/users/email/isValid",
            method: "get"
        },
        resetPassword: {
            path: "/users/:email/resetPassword",
            method: "put"
        },
        list: {
            path: "/users",
            method: "get"
        },
        notes: {
            new: {
                path: "/users/:id/notes",
                method: "post"
            },
            list: {
                path: "/users/:id/notes",
                method: "get"
            }
        }
    }
};
module.exports = endpoints;
