var React = require("react");
var BSCol = require("react-bootstrap/Col");
var BSInput = require("react-bootstrap/Input");
var actions = require("actions");
var MKAlert = require("mykoop-core/components/Alert");

var __ = require("language").__;

var PasswordRecoveryPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function(){
    return {
      email : null,
      emailStyle: null,
      hasError: null,
      feedbackMessage: null
    }
  },

  onSubmit: function(e){
    e.preventDefault();
    var self = this;
    actions.user.passwordRecovery(
      {
        data: {
          email: self.state.email
        }
      },
      function(err){
        self.setState({
          hasError: !!err,
          feedbackMessage: __("user::passwordRecoveryRequest", { context: !!err ? "fail": "success" } )
        });
      }
    );
  },

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
       <MKAlert bsStyle="danger">
          {this.state.hasError ? this.state.feedbackMessage : null}
        </MKAlert>
        <MKAlert bsStyle="success">
          {!this.state.hasError? this.state.feedbackMessage : null}
        </MKAlert>
        <form onSubmit={this.onSubmit}>
          <BSInput
            type="text"
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

module.exports = PasswordRecoveryPage;
