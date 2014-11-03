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

  onSubmit: function(e){
    e.preventDefault();
    //form validation before submit;
    var self = this;
    //FIX ME: Task #7 - Implement login submit
    actions.user.tryLogin(
      {
        data: {
          email: self.state.email,
          password: self.state.password
        }
      },
      function (err, res) {
        if (err) {
          console.error(err);
		  //handle error
        }
        self.setState({ loggedIn: res.success});
        if(self.hasLoggedIn()){
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
                   currently no known official way to do this
          //FIXME:: Implement proper redirect on button click*/
           }

        <BSButtonGroup className="btn-block" vertical>
          <BSButton block bsStyle="primary">Create your account</BSButton>
          <BSButton block bsStyle="info" >Forgot your password</BSButton>
        </BSButtonGroup>
      </div>
    );
  }
});

module.exports = LoginBox;
