//FIXME: Many of these routes are temporary/as a demo, until a better demo is
// documented or showcased in module.base.
var endpoints = {
  user: {
    getSaltWithEmail: {
      path: "/user/getSaltWithEmail/:email",
      method: "get"
    },
    getSaltWithId: {
      path: "/user/getSaltWithid/:id",
      method: "get"
    },
    tryLogin: {
      path: "/user/tryLogin/:email/:pwdhash",
      method: "get"
    },
    getProfile{
      path: "user/getProfile/:id",
      method: "get"
    },
    testEmailUnique{
      path: "user/testEmailUnique/:email",
      method: "get"
    },
  }
};

export = endpoints;
