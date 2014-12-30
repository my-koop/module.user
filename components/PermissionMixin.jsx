var _ = require("lodash");
var React = require("react");

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
        if (permissions.hasOwnProperty("loggedIn") && !permissions.loggedIn) {
          if (!localSession.user) {
            hasEnoughPermissions = true;
          }
        } else if(localSession.user) {
          // Valid permissions, let's try to validate them.
          hasEnoughPermissions = validatePermissions(
            localSession.user.perms,
            permissions
          );
        }
      }

      if (__DEV__) {
        if (!hasEnoughPermissions) {
          console.info(
            "Invalid user permissions, tried to validate",
            permissions,
            "against",
            localSession.user ? localSession.user.perms : undefined,
            localSession.user ? "(User #" + localSession.user.id + ")" : ""
          );
        }
      }

      return hasEnoughPermissions;
    }
  },

  propTypes: {
    permissions: React.PropTypes.object
  },

  getInitialState: function() {
   return {
    userMeetsPermissions: PermissionMixin.statics.validateUserPermissions(
        this.props && this.props.permissions
      )
    };
  }
}

module.exports = PermissionMixin;
