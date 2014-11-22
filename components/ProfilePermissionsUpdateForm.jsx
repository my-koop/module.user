var React = require("react");

var BSButton = require("react-bootstrap/Button");

var MKAlert = require("mykoop-core/components/Alert");
var MKUserPermissions = require("./UserPermissions");

var actions = require("actions");
var localSession = require("session").local;
var validatePermissions = require("mykoop-user/lib/common/validatePermissions");


var __ = require("language").__;

var ProfilePermissionsUpdateForm = React.createClass({
  getInitialState: function() {
    return {
      permissions: this.props.profile.permissions
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      permissions: nextProps.profile.permissions
    });
  },

  savePermissions: function() {
    var self = this;

    actions.user.updatePermissions(
      {
        data: {
          id: this.props.userId,
          permissions: self.state.permissions
        }
      },
      function(err) {
        self.setState({
          error: err,
          success: !err
        });
      }
    );
  },

  render: function() {
    var self = this;

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

    var permissionLink = {
      value: this.props.profile.permissions,
      requestChange: function(newPermissions) {
        self.setState({
          permissions: newPermissions
        });
      }
    };

    return (
      <div>
        {userCanViewPermissions ? [
          <MKAlert bsStyle="danger">
            {this.state.error ?
              __("errors::error", {context: this.state.error.context}) :
              null
            }
          </MKAlert>,
          <MKAlert bsStyle="success">
            {this.state.success ? __("success") : null}
          </MKAlert>,
          userCanEditPermissions ?
            <p>
              {__("user::permissions_edit_instructions")}
            </p> :
            null
          ,
          <MKUserPermissions
            permissionLink={permissionLink}
            readOnly={!userCanEditPermissions}
          />,
          userCanEditPermissions ?
            <BSButton
              bsStyle="primary"
              onClick={this.savePermissions}
            >
              {__("user::permissions_edit_update")}
            </BSButton> :
            null
          ] :
          <MKAlert bsStyle="danger">
            {__("errors::error", {context: "nopermissions"})}
          </MKAlert>
        }
      </div>
    );
  }
});

module.exports = ProfilePermissionsUpdateForm;
