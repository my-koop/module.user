var React = require("react");

var PropTypes = React.PropTypes;

var MKPermissionSet = require("./PermissionSet");

var modulePermissions = require("dynamic-metadata").permissions;

var UserPermissions = React.createClass({
  propTypes: {
    permissionLink: PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool,
        PropTypes.number
      ]).isRequired,
      requestChange: PropTypes.func
    }).isRequired,
    readOnly: PropTypes.bool
  },

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
