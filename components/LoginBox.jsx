var React = require("react/addons");
var PropTypes = React.PropTypes;
var BSInput = require("react-bootstrap/Input");
var BSButton = require("react-bootstrap/Button");
var BSButtonGroup = require("react-bootstrap/ButtonGroup");
var BSAlert = require("react-bootstrap/Alert");

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
    return this.props.state || {};
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

  tryGetSalt: function(email){
    var self = this;
    var salt = null;
    var req = ajax.request( {endpoint: "/user/getSalt/" + email},
      function(err, res){
        if (err) {
          console.error(status, err.toString());
          return;
        }
        // use res object
        salt = res.body.salt;
      }
    );
    return salt;
  },
  encryptPasswordWithSalt: function(password,salt){
    var passwordHash;
    //do actual encryption
    passwordHash = password;
    //return result
    return passwordHash;
  },
  tryLogin:function(email,passwordHash){
    var login = false;
    var req = ajax.request( {endpoint: "/user/tryLogin/" + email + "/" + passwordHash},
      function(err, res){
        if (err) {
          console.error(status, err.toString());
          return;
        }
        // use res object
        login = (res.body.isValid == 1)?true:false;
      }
    );
    return login;
  },

  onSubmit: function(e){
    e.preventDefault();

    //If both fields are filled

    // try get salt with  entered email
    var salt = tryGetSalt(this.state.email);
    if(salt === null){
      //Email not in DB
      emailState = 2;
    } else {
      //We have user's salt
      this.state.salt = salt;
      //encrypt pwd with salt
      var passwordHash = encryptPasswordWithSalt(this.state.password,this.state.salt);
      //test pwd match db
      var isLogin = this.tryLogin(this.state.email,passwordHash);
      //if match
      if(isLogin){
        //login
      } else {
        //Password/email dont match
      }

    }


    var errorMessage =
      (emailState === 2 && "Invalid E-Mail address") ||
      (emailState === 3 && "Unrecognised E-Mail address") ||
      (pwdState === 2 && "Invalid Password") ||
      "";

    var hasErrors = emailState > 1 || pwdState > 1;
    var loginSuccessful = !hasErrors;
    var self = this;
    this.setState({
      emailState: emailState,
      pwdState: pwdState,
      errorMessage: errorMessage
    }, function(){
      if(loginSuccessful){
        if(self.props.onLoginSuccess){
          self.props.onLoginSuccess();
        }
      }
    });
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
            placeholder="E-Mail"
            label="E-Mail"
            labelClassName="sr-only"
            bsStyle={this.getSuccessStyle(this.state.emailState)}
            hasFeedback
            valueLink={this.linkState("email")}
          />
          <BSInput
            type="password"
            placeholder="Password"
            label="Password"
            labelClassName="sr-only"
            bsStyle={this.getSuccessStyle(this.state.pwdState)}
            hasFeedback
            valueLink={this.linkState("password")}
          />
          <BSInput type="checkbox" label="Remember Me" checkedLink={this.linkState("rememberMe")}/>
          <BSInput block type="submit" bsStyle="success" bsSize="large" value="Login" />
        </form>
        {/*FIXME:: style on the node is to make vertical buttongroup take 100% width
                   currently no known official way to do this*/}
        <BSButtonGroup vertical style={{display:"block"}}>
          <BSButton block bsStyle="primary">Create your account</BSButton>
          <BSButton block bsStyle="info" >Forgot your password</BSButton>
        </BSButtonGroup>
      </div>
    );
  }
});

module.exports = LoginBox;
