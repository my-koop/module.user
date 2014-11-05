
var endpoints = {
  user: {
    tryLogin: {
      path: "/user/tryLogin/:email/:pwdhash",
      method: "get"
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
      method: "put"
    }
  }
};

export = endpoints;
