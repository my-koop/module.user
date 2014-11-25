var _ = require("lodash");

function validatePermissions(userPermissions, requiredPermissions): boolean {
  // Try to find a required permission that is not met by the user.
  return _.every(requiredPermissions, function(permission, key) {
    var userPermission = userPermissions[key];

    if (!userPermission) {
      return false;
    }

    if (_.isPlainObject(permission)) {
      if (!_.isPlainObject(userPermission)) {
        return true;
      }

      return validatePermissions(userPermission, permission);
    }

    if (_.isPlainObject(userPermission)) {
      return false;
    }

    return userPermission >= permission;
  });
}

export = validatePermissions;
