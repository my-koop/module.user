var React         = require("react/addons");
var PropTypes     = React.PropTypes;
var BSInput       = require("react-bootstrap/Input");
var BSButton      = require("react-bootstrap/Button");
var BSButtonGroup = require("react-bootstrap/ButtonGroup");
var MKAlert = require("mykoop-core/components/Alert");
var MKFeedbacki18nMixin = require("mykoop-core/components/Feedbacki18nMixin");

var ajax = require("ajax");
var actions = require("actions");
var localSession = require("session").local;
var Router = require("react-router");

var website = require("website");
var _ = require("lodash");
var __ = require("language").__;

var LoginBox = React.createClass({
  mixins: [React.addons.LinkedStateMixin, MKFeedbacki18nMixin],

  propTypes: {
    state: PropTypes.object,
    saveStateCallback: PropTypes.func.isRequired,
    onLoginSuccess: PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      saveStateCallback:function() {}
    };
  },

  getInitialState: function() {
    var state = this.props.state || {};
    return {
      email: state.email,
      password: state.password,
    };
  },

  componentWillUnmount: function() {
    this.props.saveStateCallback(this.state);
  },

  getSuccessStyle: function(state) {
    switch(state) {
      case 1: return "success";
      case 2: return "error";
      case 3: return "warning";
      default: return null;
    }
  },

  onSubmit: function(e) {
    //form validation before submit;
    var self = this;
    this.clearFeedback();
    actions.user.login(
      {
        i18nErrors: {
          prefix: "user::errors",
          keys: ["app"]
        },
        data: {
          email: self.state.email,
          password: self.state.password
        }
      },
      function (err, userInfo) {
        if(err) {
          if(err.context == "validation") {
            var keys = _.keys(err.app);
            self.setState({
              emailFieldState: _.contains(keys, "email") ? 2 : null,
              passwordFieldState: _.contains(keys, "password") ? 2 : null
            });
          }
          return self.setFeedback(err.i18n, "danger");
        }

        var onLoginSuccess = self.props.onLoginSuccess;
        localSession.user = userInfo;

        self.setFeedback({key: "user::loggedin"}, "success");
        self.setState({
          emailFieldState: 1,
          passwordFieldState: 1
        }, function(err, res) {
          setTimeout(function() {
            if (onLoginSuccess) {
              onLoginSuccess();
            }

            website.render();

            // Redirect post-login. If there is a pre-login transition,
            // re-execute it, otherwise redirect to the homepage.
            if (localSession.attemptedTransition) {
              localSession.attemptedTransition.retry();
            } else {
              Router.transitionTo("home");
            }
          }, 2000);
        });
      }
    );
  },

  redirect: function(routeName) {
    Router.transitionTo(routeName);
    this.props.onRedirect && this.props.onRedirect();
  },

  render: function() {
    var self = this;
    return (
      <div>
        {this.renderFeedback()}
        <iframe name="rememberme" src="about:blank" className="hidden"/>
        <form
          target="rememberme"
          onSubmit={this.onSubmit}
          autoComplete="on"
          method="post"
          action="about:blank"
        >
          <BSInput
            type="email"
            placeholder={__("user::field_email")}
            label={__("user::field_email")}
            labelClassName="sr-only"
            name="username"
            bsStyle={this.getSuccessStyle(this.state.emailFieldState)}
            hasFeedback
            valueLink={this.linkState("email")}
          />
          <BSInput
            type="password"
            placeholder={__("user::field_password")}
            label={__("user::field_password")}
            labelClassName="sr-only"
            name="password"
            bsStyle={this.getSuccessStyle(this.state.passwordFieldState)}
            hasFeedback
            valueLink={this.linkState("password")}
          />
          <BSInput
            type="checkbox"
            label={__("user::field_remember_me")}
            checkedLink={this.linkState("rememberMe")}
          />
          <BSInput
            block
            type="submit"
            bsStyle="success"
            bsSize="large"
            value={__("user::field_login_submit")}
          />
        </form>
        {/*FIXME:: style on the node is to make vertical buttongroup take 100% width
                   currently no known official way to do this*/}

        <BSButtonGroup className="btn-block" vertical>
          <BSButton
            block
            bsStyle="primary"
            onClick={_.bind(this.redirect, this, "register")}
          >
            {__("user::button_redirect_register")}
          </BSButton>
          <BSButton
            block
            bsStyle="info"
            onClick={_.bind(this.redirect, this, "passwordrecovery")}
          >
            {__("user::button_redirect_lostpwd")}
          </BSButton>
        </BSButtonGroup>
      </div>
    );
  }
});

module.exports = LoginBox;
