var React = require("react");

var BSMenuItem = require("react-bootstrap/MenuItem");

var MKIcon = require("mykoop-core/components/Icon");

var actions = require("actions");
var localSession = require("session").local;
var website = require("website");

var __ = require("language").__;

var UserLogoutMenuItem = React.createClass({
  onMenuLogout: function() {
    delete localSession.user;
    website.render();

    if (!actions.user) {
      return;
    }

    // This is a fire and forget call to try to keep the backend in sync. No
    // error management is going to help us in production.
    actions.user.current.logout(function (err) {
      if (err) {
        console.error(err);
      }
    });
  },

  render: function() {
    return (
      <BSMenuItem key={30} onSelect={this.onMenuLogout}>
        <MKIcon glyph="sign-out" fixedWidth /> {__("user::navbar.logout")}
      </BSMenuItem>
    );
  }
});

module.exports = UserLogoutMenuItem;
