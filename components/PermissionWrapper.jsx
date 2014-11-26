var React = require("react");

var MKPermissionMixin = require("./PermissionMixin");

var PermissionWrapper = React.createClass({
  mixins: [MKPermissionMixin],

  getIsAllowed: function() {
    if (typeof this.props.allowed === "boolean") {
      return this.props.allowed;
    }

    if (this.props.permissions) {
      return this.statics.validateUserPermissions(
        this.props.permissions
      );
    }

    console.warn(
      "Using a PermissionWrapper without specfying an 'allowed' property or " +
      "a 'permissions' property is essentially useless."
    );

    return false;
  },

  render: function() {
    return this.getIsAllowed() ?
      this.props.children :
      this.props.error || null;
  }
});

module.exports = PermissionWrapper;
