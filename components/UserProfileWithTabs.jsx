var React                = require("react");
var BSCol                = require("react-bootstrap/Col");
var BSRow                = require("react-bootstrap/Row");
var BSTabbedArea         = require("react-bootstrap/TabbedArea");
var BSTabPane            = require("react-bootstrap/TabPane");

var MKPasswordChangeForm = require("./PasswordChangeForm");
var MKProfileUpdateForm  = require("./ProfileUpdateForm");
var MKGetProfileMixin    = require("./GetProfileMixin");
var MKPermissionMixin    = require("./PermissionMixin");
var MKAlert              = require("mykoop-core/components/Alert");

var __ = require("language").__;
var _  = require("lodash");
var userContributions = require("dynamic-metadata").contributions.user;

function getHash(tab) {
  return tab.hash || /(.*::)?(.*)/.exec(tab.titleKey || "")[2];
}

var UserProfileWithTabs = React.createClass({
  mixins: [
    MKPermissionMixin,
    MKGetProfileMixin
  ],

  propTypes: {
    current: React.PropTypes.bool,
    userId: React.PropTypes.number.isRequired,
    onProfileRetrieved: React.PropTypes.func,
    metaContributions: React.PropTypes.string
  },

  expectHashEvent: false,

  hashEventHandler: function(e) {
    if (!this.expectHashEvent || (this.expectHashEvent = false)) {
      // We are guaranteed to have a string with no more and no less than one
      // hash symbol in it.
      var key = this.getTabIndexFromHash(e.newURL.split("#")[1]);
      this.selectTab(key);
    }
  },

  getInitialState: function() {
    var tabsInfo = this.getTabsInfo(this.props.metaContributions);
    var key = this.getTabIndexFromHash(
      window.location.hash.substr(1),
      tabsInfo
    );

    contributionRenderCache = {0: true};
    contributionRenderCache[key] = true;

    return {
      tabsInfo: tabsInfo,
      selectedTabKey: key,
      contributionRenderCache: contributionRenderCache
    };
  },

  componentWillMount: function () {
    var self = this;
    this.getRemoteProfile(
      {userId: this.props.userId},
      this.props.onProfileRetrieved
    );
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
    if(this.props.metaContributions !== nextProps.metaContributions) {
      var tabsInfo = this.getTabsInfo(nextProps.metaContributions);
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

  getTabsInfo: function(metaContributions) {
    var contributions = metaContributions ?
      _.toArray(userContributions[metaContributions])
      : [];

    return _([
      {
        component: function() { return MKProfileUpdateForm; },
        titleKey: "user::myaccount_tab_profile",
        priority: 100
      }
    ])
    .concat(contributions)
    .sortBy("priority")
    .filter(function(tab) {
      // Ignore bad contributions.
      return tab && _.isString(tab.titleKey);
    })
    .value();
  },

  getTabIndexFromHash: function(hash, tabsInfo) {
    tabsInfo = tabsInfo || this.state.tabsInfo;

    var key = _.indexOf(
      _.map(tabsInfo, function(tab) {return getHash(tab);}),
      hash
    );

    return ~key && key || 0;
  },

  canRenderContribution: function(key) {
    return !!this.state.contributionRenderCache[key];
  },

  selectTab: function(key) {
    var contributionRenderCache = this.state.contributionRenderCache;
    contributionRenderCache[key] = true;

    this.setState({
      selectedTabKey: key,
      contributionRenderCache: contributionRenderCache
    });
  },

  render: function() {
    var self = this;

    var content = null;
    var userId = this.getUserId();

    if(userId !== null) {
      var tabsInfo = this.state.tabsInfo;
      content = _(tabsInfo)
      .filter(function(contribution){
        var permissions = contribution.permissions;

        if (!permissions) {
          return true;
        }

        return self.constructor.validateUserPermissions(permissions);
      })
      .map(function(contribution, index) {
        var contributionComponent = contribution.component();
        return (
          <BSTabPane key={index} tab={__(contribution.titleKey)}>
            <BSRow className="top-margin-10">
              <BSCol lg={12}>
                {self.canRenderContribution(index) ?
                  <contributionComponent
                    userId={userId}
                    profile={self.getUserProfile()}
                    current={self.props.current}
                  /> : null
                }
              </BSCol>
            </BSRow>
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
        self.selectTab(key);
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
