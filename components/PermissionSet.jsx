var React     = require("react");

var MKPermission = require("./Permission");

var __ = require("language").__;

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
      var newPermPath = self.props.permPath.concat(permissionName);


      // Is it further nested?
      if (_.isPlainObject(permission)) {
        var permissionSetName = nameForPermissionSet(newPermPath);

        return (
          <li>
            {permissionSetName}
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
        <li style={{whiteSpace: "nowrap", display: "inline"}}>
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
