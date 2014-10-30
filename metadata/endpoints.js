var endpoints = {
    user: {
        tryLogin: {
            path: "/user/tryLogin/:email/:pwdhash",
            method: "get"
        },
        getProfile: {
            path: "/user/getProfile/:id",
            method: "get"
        }
    }
};

module.exports = endpoints;
