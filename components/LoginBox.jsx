var React         = require("react/addons");
var PropTypes     = React.PropTypes;
var BSInput       = require("react-bootstrap/Input");
var BSButton      = require("react-bootstrap/Button");
var BSButtonGroup = require("react-bootstrap/ButtonGroup");
var MKAlert = require("mykoop-core/components/Alert");

var ajax = require("ajax");
var actions = require("actions");
var localSession = require("session").local;
var Router = require("react-router");
var routeData = require("dynamic-metadata").routes;

var website = require("website");

var __ = require("language").__;

var LoginBox = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

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
      emailFieldState: state.emailFieldState,
      passwordFieldState : state.passwordFieldState,
      errorMessage: state.errorMessage
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

  basicFormValidation: function() {
    // FIXME:: replace with reusable validation backend and frontend system
    var isValid = true;
    if(!this.state.email || !this.state.password) {
      this.setState({
        emailFieldState: !this.state.email ? 2 : null,
        passwordFieldState: !this.state.password ? 2 : null,
        errorMessage: __("errors::error_authentication_both_fields")
      });
      isValid = false;
    }
    return isValid;
  },

  onSubmit: function(e) {
    if(!this.basicFormValidation()) {
      return;
    }
    //form validation before submit;
    var self = this;
    actions.user.login(
      {
        data: {
          email: self.state.email,
          password: self.state.password
        }
      },
      function (err, userInfo) {
        if (err) {
          var errorMessage;

          if (err.validation) {
            //TODO.
          } else {
            errorMessage = __("errors::error", {context: err.context});
          }

          self.setState({
            errorMessage: errorMessage,
            successMessage: null,
            emailFieldState: 2,
            passwordFieldState: 2
          });
          return;
        }

        self.setState({
          successMessage: __("user::loggedin"),
          errorMessage: null,
          emailFieldState: 1,
          passwordFieldState: 1
        },function(err, res) {
          setTimeout(function() {
            if (self.props.onLoginSuccess) {
              self.props.onLoginSuccess();
            }

            // Redirect post-login. If there is a pre-login transition,
            // re-execute it, otherwise redirect to the homepage.
            if (localSession.attemptedTransition) {
              localSession.attemptedTransition.retry();
            } else {
              Router.transitionTo("home");
            }
          }, 2000);
        });

        localSession.user = userInfo;
        website.render();
      }
    );
  },

  redirect: function(location) {
    console.log("redirecting");
    switch(location) {
      case "register":
        Router.transitionTo(routeData.simple.children.register.name);
        break;
      case "forgotPassword":
        //FIX ME Add redirect to forgot password page once it is implemented
        break;
      default: break;
    };
  },

  render: function() {
    return (
      <div>
        <MKAlert bsStyle="danger" permanent>
          {this.state.errorMessage}
        </MKAlert>
        <MKAlert bsStyle="success">
          {this.state.successMessage}
        </MKAlert>
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
            onClick={this.redirect.bind(null,"register")}
          >
            {__("user::button_redirect_register")}
          </BSButton>
          <BSButton
          block
          bsStyle="info"
          onclick={this.redirect.bind(null,"forgotPassword")}
          >
            {__("user::button_redirect_lostpwd")}
          </BSButton>
        </BSButtonGroup>
      </div>
    );
  }
});

module.exports = LoginBox;
