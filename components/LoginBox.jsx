var React = require("react/addons");
var PropTypes = React.PropTypes;
var BSInput = require("react-bootstrap/Input");
var BSButton = require("react-bootstrap/Button");
var BSButtonGroup = require("react-bootstrap/ButtonGroup");
var BSAlert = require("react-bootstrap/Alert");
var ajax = require("ajax");
var actions  = require("actions");
var Router = require("react-router");
var routeData = require("dynamic-metadata").routes;

var LoginBox = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    state: PropTypes.object,
    saveStateCallback: PropTypes.func.isRequired,
    onLoginSuccess: PropTypes.func
  },

  getDefaultProps: function(){
    return {
      saveStateCallback:function(){}
    };
  },

  getInitialState: function(){
    return {
      email: null,
      password: null,
      emailFieldState: null,
      passwordFieldState : null,
      errorMessage: null,
      loggedIn: null
    };
  },

  componentWillUnmount: function(){
    this.props.saveStateCallback(this.state);
  },

  getSuccessStyle: function(state){
    switch(state){
      case 1: return "success";
      case 2: return "error";
      case 3: return "warning";
      default: return null;
    }
  },

  hasLoggedIn: function(){
    return this.state.loggedIn;
  },

  basicFormValidation: function(){
    var isValid = true;
    if(!this.state.email){
      this.setState({
        emailFieldState: 2,
        errorMessage: "Both fields must be filled."
      });
      isValid = false;
    } else {
      this.setState({
        emailFieldState: 1
      });
    }
    if(!this.state.password){
      this.setState({
        passwordFieldState: 2,
        errorMessage: "Both fields must be filled."
      });
      isValid = false;
    } else {
      this.setState({
        passwordFieldState: 1
      });
    }
    return isValid;
  },

  onSubmit: function(e){
    e.preventDefault();
    if(!this.basicFormValidation()){
      return;
    }
    //form validation before submit;
    var self = this;
    actions.user.tryLogin(
      {
        data: {
          email: self.state.email,
          password: self.state.password
        }
      },
      function (err, res) {
        self.setState({ loggedIn: res.success});
        if(res.success && err === null){
          //deal with login
          //FIX ME: REMOVE this message once login handling is implemented
          self.setState({
            errorMessage: "You logged in!",
            emailFieldState: 1,
            passwordFieldState: 1
          });
        } else {
          self.setState({
            errorMessage: "The information did not match any user.",
            emailFieldState: 2,
            passwordFieldState: 2
          });
        }
      }
    );

  },
  redirect: function(location){
    console.log("redirecting");
    switch(location){
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
        {this.state.errorMessage ?
          <BSAlert bsStyle="warning">
            {this.state.errorMessage}
          </BSAlert>
        : null}
        <form onSubmit={this.onSubmit}>
          <BSInput
            type="email"
            placeholder="EMail"
            label="E-Mail"
            labelClassName="sr-only"
            bsStyle={this.getSuccessStyle(this.state.emailFieldState)}
            hasFeedback
            valueLink={this.linkState("email")}
          />
          <BSInput
            type="password"
            placeholder="Password"
            label="Password"
            labelClassName="sr-only"
            bsStyle={this.getSuccessStyle(this.state.passwordFieldState)}
            hasFeedback
            valueLink={this.linkState("password")}
          />
          <BSInput type="checkbox" label="Remember Me" checkedLink={this.linkState("rememberMe")}/>
          <BSInput block type="submit" bsStyle="success" bsSize="large" value="Login" />
        </form>
        {/*FIXME:: style on the node is to make vertical buttongroup take 100% width
                   currently no known official way to do this*/}

        <BSButtonGroup className="btn-block" vertical>
          <BSButton
            block
            bsStyle="primary"
            onClick={this.redirect.bind(null,"register")}
          >
            Create your account
          </BSButton>
          <BSButton
          block
          bsStyle="info"
          onclick={this.redirect.bind(null,"forgotPassword")}
          >
            Forgot your password
          </BSButton>
        </BSButtonGroup>
      </div>
    );
  }
});

module.exports = LoginBox;
