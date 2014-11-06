var endpoints = {
    user: {
        login: {
            path: "/user/login",
            method: "post"
        },
        getProfile: {
            path: "/user/getProfile/:id",
            method: "get"
        },
        register: {
            path: "/user/register",
            method: "post"
        },
        updateProfile: {
            path: "/user/updateProfile/:id",
            method: "put"
        }
    }
};

module.exports = endpoints;
