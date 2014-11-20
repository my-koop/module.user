var React = require("react");

var MKUserPermissions = require("./UserPermissions");

var __ = require("language").__;

var ProfilePermissionsUpdateForm = React.createClass({
  render: function() {
    return (
      <div>
        <p>
          {__("user::permissions_edit_instructions")}
        </p>
        <MKUserPermissions
          userPerms={this.props.profile.permissions}
        />
      </div>
    );
  }
});

module.exports = ProfilePermissionsUpdateForm;
