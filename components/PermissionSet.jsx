var React     = require("react");

var MKPermission = require("./Permission");

function nameForPermissionSet(permPath) {
  var i18nkey = "permissions::" + permPath.join(".") + ".__description";

  return __(i18nkey);
}

var PermissionSet = React.createClass({
  getDefaultProps: function() {
    return {
      userPerms: {},
      permPath: []
    };
  },

  render: function() {
    var self = this;

    var permList = _.map(this.props.refPerms, function(permission, permissionName) {
      var newPermPath = _.clone(this.props.permPath);
      newPermPath.push(permissionName);

      // Is it further nested?
      if (_.isPlainObject(permission)) {
        return (
          <li>
            <PermissionSet
              userPerms={self.props.userPerms[permissionName]}
              refPerms={permission}
              permPath={newPermPath}
            />
          </li>
        );
      }

      // A leaf!
      return (
        <li>
          <MKPermission
            userPerm={self.props.userPerms[permissionName]}
            refPerm={permission}
            permPath={newPermPath}
          />
        </li>
      );
    });

    return (
      <ul>
        {permList}
      </ul>
    );
  }
});

module.exports = PermissionSet;
