
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
    }

  }
};

export = endpoints;
