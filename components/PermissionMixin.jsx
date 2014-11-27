var _ = require("lodash");

var validatePermissions = require("../lib/common/validatePermissions");

var localSession = require("session").local;

var PermissionMixin = {
  statics: {
    validateUserPermissions: function(permissions) {
      var hasEnoughPermissions = false;

      if (permissions && !_.isPlainObject(permissions)) {
        console.warn(
          "You need to call PermissionMixin with an object literal."
        );
        hasEnoughPermissions = true
      } else if (!permissions || _.isEmpty(permissions)) {
        hasEnoughPermissions = true;
      }

      if (!hasEnoughPermissions) {
        if (!localSession.user) {
          hasEnoughPermissions = false;
        } else {
          // Valid permissions, let's try to validate them.
          hasEnoughPermissions = validatePermissions(
            localSession.user.perms,
            permissions
          );
        }
      }

      return hasEnoughPermissions;
    }
  },

  propTypes: {
    permissions: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
   return {
    userMeetsPermissions: PermissionMixin.statics.validateUserPermissions(
      this.props.permissions
    )
   };
  }
}

module.exports = PermissionMixin;
