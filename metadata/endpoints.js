var endpoints = {
    user: {
        login: {
            path: "/users/login",
            method: "post"
        },
        getProfile: {
            path: "/users/:id",
            method: "get"
        },
        register: {
            path: "/users",
            method: "post"
        },
        updateProfile: {
            path: "/users/current",
            method: "put"
        },
        updateCurrentUserPassword: {
            path: "/users/current/password",
            method: "put",
            validation: {
                resolve: "validation",
                value: "validateUpdateUserPassword"
            }
        },
        updateUserPassword: {
            path: "/users/:id/password",
            method: "put",
            validation: {
                resolve: "validation",
                value: "validateUpdateUserPassword"
            }
        },
        emailExists: {
            path: "/users/email",
            method: "get"
        }
    }
};

module.exports = endpoints;
