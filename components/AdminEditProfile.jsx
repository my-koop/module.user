var React = require("react");

var BSCol = require("react-bootstrap/Col");
var BSButton = require("react-bootstrap/Button");

var MKUserProfileWithTabs = require("./UserProfileWithTabs");
var MKIcon = require("mykoop-core/components/Icon");
var MKConfirmationTrigger = require("mykoop-core/components/ConfirmationTrigger");

var __ = require("language").__;
var actions = require("actions");

var AdminEditProfile = React.createClass({
  getInitialState: function() {
    return {
      isProfileActive: null
    }
  },

  checkProfile: function(err, userProfile) {
    if(!err) {
      this.setState({
        isProfileActive: !userProfile.deactivated
      });
    }
  },

  toggleUserActive: function() {
    var self = this;
    actions.user.activation({
      i18nErrors: {},
      alertErrors: true,
      alertSuccess: true,
      data: {
        id: this.props.params.id,
        activate: +!this.state.isProfileActive
      }
    }, function(err, res) {
      if(!err) {
        self.setState({
          isProfileActive: res.isActive
        });
      }
    })
  },

  render: function() {
    var userId = parseInt(this.props.params.id);
    var isProfileActive = this.state.isProfileActive;
    var changeProfileActived = isProfileActive !== null ?
      (
        <span className="pull-right h1">
          <MKConfirmationTrigger
            message={__("areYouSure")}
            onYes={this.toggleUserActive}
          >
            <BSButton
              bsStyle={isProfileActive ? "danger" : "success"}
            >
              <MKIcon
                fixedWidth
                glyph={isProfileActive ? "close": "check"}
              />
              {__(isProfileActive ?
                  "user::deactivateProfile"
                : "user::activateProfile"
              )}
            </BSButton>
          </MKConfirmationTrigger>
        </span>
      )
      : null;
    return (
      <BSCol>
        <h1 className="pull-left">
          {__("user::adminEditWelcome", {userId: userId})}
        </h1>
        {changeProfileActived}
        <span className="clearfix" />
        <MKUserProfileWithTabs
          userId={userId}
          onProfileRetrieved={this.checkProfile}
          metaContributions="profileEdit"
        />
      </BSCol>
    );
  }
});

module.exports = AdminEditProfile;
