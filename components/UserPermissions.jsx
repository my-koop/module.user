var React = require("react");

var modulePermissions = require("dynamic-metadata").permissions;

var validatePermissions = require("mykoop-user/lib/common/validatePermissions");

var localSession = require("session").local;

var MKPermissionSet = require("./PermissionSet");

var UserPermissions = React.createClass({
  render: function() {
    var userPermissions = localSession.user.perms;

    var userCanEditPermissions = validatePermissions(userPermissions, {
      user: {
        profile: {
          permissions: {
            edit: true
          }
        }
      }
    });

    //FIXME: Leverage this higher up so the permissions tab doesn't get shown.
    var userCanViewPermissions = validatePermissions(userPermissions, {
      user: {
        profile: {
          permissions: {
            view: true
          }
        }
      }
    });

    return (
      <div className="permissions">
        <MKPermissionSet
          permissionLink={this.props.permissionLink}
          refPerms={modulePermissions}
          readOnly={!userCanEditPermissions}
        />
      </div>
    );
  }
});

module.exports = UserPermissions;
