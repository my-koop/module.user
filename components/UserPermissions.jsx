var React = require("react");

var MKPermissionSet = require("./PermissionSet");

var modulePermissions = require("dynamic-metadata").permissions;

var UserPermissions = React.createClass({
  render: function() {
    return (
      <div className="permissions">
        <MKPermissionSet
          permissionLink={this.props.permissionLink}
          refPerms={modulePermissions}
          readOnly={this.props.readOnly}
        />
      </div>
    );
  }
});

module.exports = UserPermissions;
