var React = require("react");

var BSCol = require("react-bootstrap/Col");

var MKUserProfileWithTabs = require("./UserProfileWithTabs");

var __ = require("language").__;

var AdminEditProfile = React.createClass({
  render: function() {
    var userId = parseInt(this.props.params.id);
    return (
      <BSCol>
        <h1>
          {__("user::adminEditWelcome", {userId: userId})}
        </h1>
        <MKUserProfileWithTabs
          userId={userId}
          metaPlugins="adminEditPlugins"
        />
      </BSCol>
    );
  }
});

module.exports = AdminEditProfile;
