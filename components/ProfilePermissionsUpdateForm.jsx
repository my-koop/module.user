var React = require("react");

var BSButton = require("react-bootstrap/Button");

var MKAlert = require("mykoop-core/components/Alert");
var MKUserPermissions = require("./UserPermissions");

var actions = require("actions");

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
        <p>
          {__("user::permissions_edit_instructions")}
        </p>
        <MKAlert bsStyle="danger">
          {this.state.error ?
            __("errors:error", {context: this.state.error.context}) :
            null
          }
        </MKAlert>
        <MKAlert bsStyle="success">
          {this.state.success ?
            __("success") :
            null
          }
        </MKAlert>
        <MKUserPermissions
          permissionLink={permissionLink}
          readOnly={this.props.readOnly}
        />
        <BSButton
          bsStyle="primary"
          onClick={this.savePermissions}
        >
          {__("user::permissions_edit_update")}
        </BSButton>
      </div>
    );
  }
});

module.exports = ProfilePermissionsUpdateForm;
