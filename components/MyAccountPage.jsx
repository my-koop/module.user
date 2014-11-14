var React                = require("react");
var PropTypes            = React.PropTypes;
var BSCol                = require("react-bootstrap/Col");
var BSTabbedArea         = require("react-bootstrap/TabbedArea");
var BSTabPane            = require("react-bootstrap/TabPane");
var MKPasswordChangeForm = require("./PasswordChangeForm");
var MKProfileUpdateForm  = require("./ProfileUpdateForm");


var localSession = require("session").local;
var __ = require("language").__;
var _  = require("lodash");
var myAccountPlugins = require("dynamic-metadata").myAccountPlugins;

var MyAccountPage = React.createClass({

  render: function() {
    var tabsInfo = [
      {
        component: function() { return MKProfileUpdateForm; },
        titleKey: "user::myaccount_tab_profile"
      },
      {
        component: function() { return MKPasswordChangeForm; },
        titleKey: "user::myaccount_tab_password"
      }
    ].concat(_.toArray(myAccountPlugins));

    var additionalTabs = _.map(tabsInfo, function(plugin, index) {
      var PluginComponent = plugin.component();
      return (
        <BSTabPane key={index} tab={__(plugin.titleKey)}>
          <BSCol md={4} sm={6}>
            <PluginComponent id={2} />
          </BSCol>
        </BSTabPane>
      );
    });

    return (
      <BSCol>
   
        <BSTabbedArea defaultActiveKey={0}>
          {additionalTabs}
        </BSTabbedArea>
      </BSCol>
    );
  }
});

module.exports = MyAccountPage;
