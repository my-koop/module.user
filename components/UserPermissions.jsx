var React = require("react");

var modulePermissions = require("dynamic-metadata").permissions;

var MKPermissionSet = require("./PermissionSet");

var UserPermissions = React.createClass({
  getDefaultProps: function() {
    return {
      userPerms: {}
    };
  },

  render: function() {
    <MKPermissionSet
      userPerms={self.props.userPerms}
      refPerms={modulePermissions}
    />
  }
});

module.exports = UserPermissions;
