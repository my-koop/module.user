
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
    updatePermissions: {
      path: "/users/:id/permissions",
      method: "put"
    },
    login: {
      path: "/users/login",
      method: "post"
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
      method: "post"
    },
    emailExists: {
      path: "/users/email/isValid",
      method: "get"
    },
    list: {
      path : "/users",
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

export = endpoints;
