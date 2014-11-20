var React = require("react");
var BSCol = require("react-bootstrap/Col");

var __           = require("language").__;
var _            = require("lodash");

var MyAccountPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function(){
    return {
      email : null,
      inputStyle: null,
    }
  },
  getSuccessStyle: function(state) {
    switch(state) {
      case 1: return "success";
      case 2: return "error";
      case 3: return "warning";
      default: return null;
    }
  },
  onSubmit: function(e){
    e.preventDefault();
    var self = this;
    actions.user.passwordRecovery({
      data: {
        email: this.state.email
      }
    }. function(err){

    })
  }

  render: function() {
    var self = this;
    return (
      <BSCol>
        <h1>
          {__("user::passwordRecoveryWelcome")}
        </h1>
        <span>
          {__("user::passwordRecoveryExplanation")}
        </span>
        <form onSubmit={this.onSubmit}>
          <BSInput
            type="text"
            bsStyle={this.getSuccessStyle(this.state.inputStyle)}
            placeholder={__("user::passwordRecoveryEmailPlaceholder")}
            valueLink={this.linkState("email")}
          />
          <BSInput
            type="submit"
            block
            bsStyle="primary"
            value={__("user::passwordRecoverySubmit")}
          />
        </form>
      </BSCol>
    );
  }
});

module.exports = MyAccountPage;
