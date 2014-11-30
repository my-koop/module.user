var _ = require("lodash");
var React = require("react/addons");

var MKPermissionMixin = require("./PermissionMixin");

var PermissionWrapper = React.createClass({
  mixins: [MKPermissionMixin],

  propTypes: {
    allowed: React.PropTypes.bool,
    permissions: React.PropTypes.object
  },

  getIsAllowed: function() {
    if (typeof this.props.allowed === "boolean") {
      return this.props.allowed;
    }

    if (this.props.permissions) {
      return this.constructor.validateUserPermissions(
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
    return this.getIsAllowed() ? (
      React.Children.count(this.props.children) === 1 ?
        React.addons.cloneWithProps(
          React.Children.only(this.props.children),
          _.omit(this.props, ["children", "permissions"])
        ) :
        this.props.children
      ) :
      this.props.error || null;
  }
});

module.exports = PermissionWrapper;
