var React = require("react");
var BSCol = require("react-bootstrap/Col");

var MKUserProfileWithTabs = require("./UserProfileWithTabs");

var localSession = require("session").local;
var __           = require("language").__;
var _            = require("lodash");

var MyAccountPage = React.createClass({

  render: function() {
    var self = this;
    return (
      <BSCol>
        <h1>
          {__("user::myAccountWelcome")}
        </h1>
        <MKUserProfileWithTabs
          current
          userId={localSession.user.id}
          metaPlugins="myAccountPlugins"
        />
      </BSCol>
    );
  }
});

module.exports = MyAccountPage;
