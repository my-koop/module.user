var React     = require("react");

var BSInput  = require("react-bootstrap/Input");

var MKPermission = require("./Permission");

var _ = require("lodash");

var __ = require("language").__;

function nameForPermissionSet(permPath) {
  var i18nkey = "permissions::" + permPath.join(".") + ".__description";

  return __(i18nkey);
}

var PermissionSet = React.createClass({
  getDefaultProps: function() {
    return {
      permPath: []
    };
  },

  updateSection: function(sectionName, e) {
    var checked = e.target.checked;
    var requestChange = this.props.permissionLink.requestChange;
    var permission = this.props.permissionLink.value;

    if (checked) {
      permission[sectionName] = true;
    } else {
      delete permission[sectionName];
    }

    requestChange && requestChange(permission);
  },

  createPermissionLink: function(permissionName, isLeaf) {
    var self = this;
    var permissions = self.props.permissionLink.value;
    var requestChange = self.props.permissionLink.requestChange || function(){};

    return {
      value: permissions[permissionName] === 0 ?
        0 :
        permissions[permissionName] || (!isLeaf && {}) || undefined,
      requestChange: function(newPermissions) {
        if (
          newPermissions === 0 ||
          (newPermissions && !_.isEqual(newPermissions, {}))
        ) {
          permissions[permissionName] = newPermissions;
        } else {
          delete permissions[permissionName];
        }

        requestChange(permissions);
      }
    };
  },

  render: function() {
    var self = this;

    var permList = _.map(this.props.refPerms, function(permission, permissionName) {
      var newPermPath = self.props.permPath.concat(permissionName);

      // Is it further nested?
      if (_.isPlainObject(permission)) {
        var permissionSetName = nameForPermissionSet(newPermPath);
        var permissionValue = self.props.permissionLink.value[permissionName];
        var overridesTree = !_.isUndefined(permissionValue) &&
                            !_.isPlainObject(permissionValue);

        return (
          <li key={permissionName}>
            {!self.props.readOnly ?
              <form className="form-horizontal">
                <BSInput
                  type="checkbox"
                  label={permissionSetName}
                  checked={overridesTree}
                  disabled={self.props.disabled}
                  onChange={self.updateSection.bind(null, permissionName)}
                />
              </form> :
              permissionSetName
            }
            {!self.props.readOnly && self.props.permissionLink.value ?
              <PermissionSet
                refPerms={permission}
                permPath={newPermPath}
                permissionLink={self.createPermissionLink(permissionName)}
                readOnly={self.props.readOnly}
                disabled={self.props.disabled || overridesTree}
              /> :
              null
            }
          </li>
        );
      }

      // A leaf!
      return (
        <li key={permissionName} className="permissions-leaf-wrapper">
          <MKPermission
            refPerm={permission}
            permPath={newPermPath}
            disabled={self.props.disabled}
            readOnly={self.props.readOnly}
            permissionLink={self.createPermissionLink(permissionName, true)}
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
