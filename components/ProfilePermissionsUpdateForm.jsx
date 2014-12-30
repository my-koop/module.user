var React = require("react");
var PropTypes = React.PropTypes;

var BSButton = require("react-bootstrap/Button");
var BSCol = require("react-bootstrap/Col");

var MKAlert           = require("mykoop-core/components/Alert");
var MKAlertTrigger    = require("mykoop-core/components/AlertTrigger");
var MKUserPermissions = require("./UserPermissions");
var MKPermissionMixin = require("./PermissionMixin");

var actions = require("actions");

var __ = require("language").__;

var ProfilePermissionsUpdateForm = React.createClass({
  mixins: [MKPermissionMixin],

  propTypes: {
    userId: PropTypes.number.isRequired,
    profile: PropTypes.shape({
      permissions: PropTypes.object.isRequired,
    }).isRequired
  },

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
        if (err) {
          MKAlertTrigger.showAlert(
            {
              title: <strong className="text-danger">{__("errors::error")}</strong>,
              message: __("errors::error", {context: err.context}) + "."
            }
          );
        }

        self.setState({
          success: !err
        }, function() {
          if (!err) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
          }
        });
      }
    );
  },

  render: function() {
    var self = this;

    var userCanEditPermissions = this.constructor.validateUserPermissions({
      user: {
        profile: {
          permissions: {
            edit: true
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
        {this.props.profile.permissions === true ?
          <MKAlert bsStyle="warning" key="warning" permanent>
            {__("user::permissions_super_admin")}
          </MKAlert> : [
            <MKAlert bsStyle="success" key="success">
              {this.state.success ? __("user::permissions_edit_success") : null}
            </MKAlert>,
            <div key="instructions">
              {userCanEditPermissions ?
                <p>
                  {__("user::permissions_edit_instructions")}
                </p> :
                null
              }
            </div>,
            <MKUserPermissions
              key="perms"
              permissionLink={permissionLink}
              readOnly={!userCanEditPermissions}
            />,
            <BSCol md={6} key="button">
              {userCanEditPermissions ?
                <BSButton
                  bsStyle="success"
                  className="pull-right"
                  onClick={this.savePermissions}
                >
                  {__("user::permissions_edit_update")}
                </BSButton> :
                null
              }
            </BSCol>
          ]
        }
      </div>
    );
  }
});

module.exports = ProfilePermissionsUpdateForm;
