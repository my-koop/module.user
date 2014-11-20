var React                = require("react");
var BSCol                = require("react-bootstrap/Col");
var BSTabbedArea         = require("react-bootstrap/TabbedArea");
var BSTabPane            = require("react-bootstrap/TabPane");

var MKPasswordChangeForm = require("./PasswordChangeForm");
var MKProfileUpdateForm  = require("./ProfileUpdateForm");
var MKGetProfileMixin    = require("./GetProfileMixin");
var MKAlert              = require("mykoop-core/components/Alert");

var __ = require("language").__;
var _  = require("lodash");
var metadata = require("dynamic-metadata");

var UserProfileWithTabs = React.createClass({
  mixins: [MKGetProfileMixin],

  propTypes: {
    current: React.PropTypes.bool,
    userId: React.PropTypes.number.isRequired,
    metaPlugins: React.PropTypes.string
  },

  componentWillMount: function () {
    var self = this;
    this.getRemoteProfile({userId: this.props.userId});
  },

  componentWillReceiveProps: function (nextProps) {
    this.getRemoteProfile({userId: nextProps.userId});
  },

  render: function() {
    var self = this;

    var content = null;
    var userId = this.getUserId();
    var plugins = this.props.metaPlugins ?
      _.toArray(metadata[this.props.metaPlugins])
      : [];
    if(userId !== null) {
      var tabsInfo = [
        {
          component: function() { return MKProfileUpdateForm; },
          titleKey: "user::myaccount_tab_profile"
        },
        {
          component: function() { return MKPasswordChangeForm; },
          titleKey: "user::myaccount_tab_password"
        }
      ].concat(plugins);

      content = _.map(tabsInfo, function(plugin, index) {
        var PluginComponent = plugin.component();
        return (
          <BSTabPane key={index} tab={__(plugin.titleKey)}>
            <BSCol md={4} sm={6}>
              <PluginComponent
                userId={userId}
                profile={self.getUserProfile()}
                current={self.props.current}
              />
            </BSCol>
          </BSTabPane>
        );
      });
      content = (
        <BSTabbedArea defaultActiveKey={0}>
          {content}
        </BSTabbedArea>
      );
    }

    var remoteProfileError = this.getRemoteProfileError();
    return (
      <div>
        <MKAlert bsStyle="danger">
          {remoteProfileError ?
            __("user::invalidUserId")
          : null
          }
        </MKAlert>
        {content}
      </div>
    );
  }
});

module.exports = UserProfileWithTabs;
