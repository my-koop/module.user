var React = require("react");

var BSMenuItem = require("react-bootstrap/MenuItem");

var MKMenuItemLink = require("mykoop-core/components/MenuItemLink");
var MKIcon = require("mykoop-core/components/Icon");

var __ = require("language").__;
var _ = require("lodash");
var localSession = require("session").local;

var DashboardMenuItem = React.createClass({
  getInitialState: function() {
    return {
      hidden: false
    };
  },

  canAccessDashboard: function() {
    if (localSession.user && localSession.user.perms) {
      if (_.isPlainObject(localSession.user.perms)) {
        if (_.keys(localSession.user.perms).length > 1) {
          return true;
        }

        return false;
      }

      return true;
    }

    return false;
  },

  componentDidMount: function() {
    this.setState({
      hidden: !this.canAccessDashboard()
    });
  },

  render: function() {
    return (
      <MKMenuItemLink
        to={"/dashboard"}
        className={this.state.hidden ? "hidden" : ""}
      >
        <MKIcon glyph="desktop" fixedWidth />
        {" " + __("user::navbar.dashboard")}
      </MKMenuItemLink>
    );
  }
});

module.exports = DashboardMenuItem;
