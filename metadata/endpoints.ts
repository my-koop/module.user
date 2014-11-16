
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
          value  : "validateUpdateUserPassword"
        }
      },
      updateProfile: {
        path: "/users/current",
        method: "put"
      }
    },
    updatePassword: {
      path: "/users/:id/password",
      method: "put",
      validation: {
        resolve: "validation",
        value  : "validateUpdateUserPassword"
      }
    },
    updateProfile: {
      path: "/users/:id",
      method: "put"
    },
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
    emailExists: {
      path: "/users/email/isValid",
      method: "get"
    }
  }
};

export = endpoints;
