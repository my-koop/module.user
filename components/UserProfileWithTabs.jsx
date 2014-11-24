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

function getHash(tab) {
  return tab.hash || /(.*::)?(.*)/.exec(tab.titleKey || "")[2];
}

var UserProfileWithTabs = React.createClass({
  mixins: [MKGetProfileMixin],

  propTypes: {
    current: React.PropTypes.bool,
    userId: React.PropTypes.number.isRequired,
    metaPlugins: React.PropTypes.string
  },

  expectHashEvent: false,

  hashEventHandler: function(e) {
    if (!this.expectHashEvent || (this.expectHashEvent = false)) {
      // We are guaranteed to have a string with no more and no less than one
      // hash symbol in it.
      var key = this.getTabIndexFromHash(e.newURL.split("#")[1]);
      this.setState({
        selectedTabKey: key
      });
    }
  },

  getInitialState: function() {
    var tabsInfo = this.getTabsInfo(this.props.metaPlugins);
    var key = this.getTabIndexFromHash(
      window.location.hash.substr(1),
      tabsInfo
    );

    return {
      tabsInfo: tabsInfo,
      selectedTabKey: key
    };
  },

  componentWillMount: function () {
    var self = this;
    this.getRemoteProfile({userId: this.props.userId});
  },

  componentDidMount: function() {
    window.addEventListener(
      "hashchange",
      this.hashEventHandler,
      // MDN recommends explicting useCapture even if optional for better
      // compatibility with older browsers.
      false
    );
  },

  componentWillReceiveProps: function (nextProps) {
    if(this.props.userId !== nextProps.userId) {
      this.getRemoteProfile({userId: nextProps.userId});
    }
    if(this.props.metaPlugins !== nextProps.metaPlugins) {
      var tabsInfo = this.getTabsInfo(nextProps.metaPlugins);
      this.setState({
        tabsInfo: tabsInfo
      });
    }
  },

  componentWillUnmount: function() {
    window.removeEventListener(
      "hashchange",
      this.hashEventHandler,
      false
    );
  },

  getTabsInfo: function(metaPlugins) {
    var plugins = metaPlugins ?
      _.toArray(metadata[metaPlugins])
      : [];
    var tabsInfo = [
      {
        component: function() { return MKProfileUpdateForm; },
        titleKey: "user::myaccount_tab_profile"
      },
      {
        component: function() { return MKPasswordChangeForm; },
        titleKey: "user::myaccount_tab_password",
        hash: "password"
      }
    ].concat(plugins).filter(function(tab) {
      // avoid bad plugins
      return tab && _.isString(tab.titleKey);
    });
    return tabsInfo;
  },

  getTabIndexFromHash: function(hash, tabsInfo) {
    tabsInfo = tabsInfo || this.state.tabsInfo;

    var key = _.indexOf(
      _.map(tabsInfo, function(tab) {return getHash(tab);}),
      hash
    );

    return ~key && key || 0;
  },

  render: function() {
    var self = this;

    var content = null;
    var userId = this.getUserId();

    if(userId !== null) {
      var tabsInfo = this.state.tabsInfo;
      content = _.map(tabsInfo, function(plugin, index) {
        var PluginComponent = plugin.component();
        return (
          <BSTabPane key={index} tab={__(plugin.titleKey)}>
            <BSCol lg={12}>
              <PluginComponent
                userId={userId}
                profile={self.getUserProfile()}
                current={self.props.current}
              />
            </BSCol>
          </BSTabPane>
        );
      });
      function tabSelected(key) {
        if (key) {
          self.expectHashEvent = true;
          window.location.href = "#" + getHash(tabsInfo[key]);
        } else {
          window.history ?
            window.history.pushState("", "", window.location.pathname) :
            // This will however leave the # mark and make the page scroll.
            window.location.hash = "";
        }
        self.setState({
          selectedTabKey: key
        });
      }
      content = (
        <BSTabbedArea
          activeKey={self.state.selectedTabKey}
          onSelect={tabSelected}
        >
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
