var permissions = {
  user: {
    profile: {
      view: true,
      edit: true,
      password: true,
      permissions: {
        view: true,
        edit: true
      }
    },
    notes: {
      view: true,
      create: true
    },

    // Permission masks.
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      users: {
        view: true,
        add: true,
        remove: true
      }
    }
  }
};

export = permissions;
