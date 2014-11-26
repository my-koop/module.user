var React = require("react");

var BSCol = require("react-bootstrap/Col");

var MKUserProfileWithTabs = require("./UserProfileWithTabs");
var MKPermissionMixin = require("./PermissionMixin");
var MKPermissionRedirectMixin = require("./PermissionRedirectMixin");

var __ = require("language").__;

var AdminEditProfile = React.createClass({
  mixins: [MKPermissionMixin, MKPermissionRedirectMixin],

  render: function() {
    var userId = parseInt(this.props.params.id);
    return (
      this.state.userMeetsPermissions ?
        <BSCol>
          <h1>
            {__("user::adminEditWelcome", {userId: userId})}
          </h1>
          <MKUserProfileWithTabs
            userId={userId}
            metaPlugins="adminEditPlugins"
          />
        </BSCol>
      : null
    );
  }
});

module.exports = AdminEditProfile;
