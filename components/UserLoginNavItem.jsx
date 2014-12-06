var React = require("react");

var BSNavItem = require("react-bootstrap/NavItem");
var BSModalTrigger = require("react-bootstrap/ModalTrigger");

var MKIcon = require("mykoop-core/components/Icon");
var MKLoginModal = require("./LoginModal");

var __ = require("language").__;
var _ = require("lodash");

var UserLoginNavItem = React.createClass({
  onMenuLogin: function() {
    this.refs.loginmodal.show();
  },

  render: function() {
    var others = _.omit(this.props,
      "active",
      "activeHref",
      "activeKey",
      "key",
      "navItem",
      "ref",
      "onSelect"
    );
    return (
      <BSNavItem onSelect={this.onMenuLogin} key="userlogin" {...others}>
        <BSModalTrigger
          ref="loginmodal"
          modal={<MKLoginModal />}
        >
          {/*FIXME: Dummy span so we can use the modal trigger... :( */}
          <span />
        </BSModalTrigger>
        <MKIcon library="glyphicon" glyph="log-in" /> {__("user::navbar.login")}
      </BSNavItem>
    );
  }
});

module.exports = UserLoginNavItem;
