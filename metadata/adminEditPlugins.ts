var adminEditPlugins = {
  permissions: {
    component: {
      resolve: "component",
      value: "ProfilePermissionsUpdateForm"
    },
    titleKey: "user::useredit_tab_permissions",
    hash: "permissions"
  },
  notes: {
    component: {
      resolve: "component",
      value: "Notes"
    },
    titleKey: "user::useredit_tab_notes",
    hash: "notes"
  }
};

export = adminEditPlugins;
