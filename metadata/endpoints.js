var endpoints = {
    user: {
        tryLogin: {
            path: "/user/tryLogin/",
            method: "post"
        },
        getProfile: {
            path: "/user/getProfile/:id",
            method: "get"
        },
        register: {
            path: "/user/register/",
            method: "post"
        },
        updateProfile: {
            path: "/user/updateProfile/:id",
            method: "post"
        },
        updatePassword: {
            path: "/user/updatePassword/:id",
            method: "post"
        }
    }
};

module.exports = endpoints;
