var React = require("react/addons");
var PropTypes = React.PropTypes;
var BSInput = require("react-bootstrap/Input");
var BSButton = require("react-bootstrap/Button");
var BSButtonGroup = require("react-bootstrap/ButtonGroup");
var BSAlert = require("react-bootstrap/Alert");
var ajax = require("ajax");

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



  onSubmit: function(e){
    e.preventDefault();
    //FIX ME: Task #7 - Implement login submit

    //FIX ME: Add input validation
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
          //FIXME:: Implement proper redirect on button click
        <BSButtonGroup className="btn-block" vertical>
          <BSButton block bsStyle="primary">Create your account</BSButton>
          <BSButton block bsStyle="info" >Forgot your password</BSButton>
        </BSButtonGroup>
      </div>
    );
  }
});

module.exports = LoginBox;
