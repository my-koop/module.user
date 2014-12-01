var React = require("react");

var BSCol = require("react-bootstrap/Col");
var BSInput = require("react-bootstrap/Input");

var MKAlert = require("mykoop-core/components/Alert");
var MKFeedbacki18nMixin = require("mykoop-core/components/Feedbacki18nMixin");

var __ = require("language").__;
var actions = require("actions");

var PasswordRecoveryPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, MKFeedbacki18nMixin],

  getInitialState: function() {
    return {
      email : null,
      emailStyle: null,
      hasError: null,
      feedbackMessage: null
    }
  },

  onSubmit: function(e) {
    e.preventDefault();
    this.clearFeedback();
    var self = this;
    actions.user.resetPassword(
      {
        i18nErrors: {
          keys: ["app"],
          prefix: "user::pwdRecovery"
        },
        data: {
          email: self.state.email
        }
      },
      function(err) {
        if(err) {
          return self.setFeedback(err.i18n, "danger");
        }
        self.setFeedback(
          {key: "user::passwordRecoveryRequest_success"},
          "success"
        );
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
        {this.renderFeedback()}
        <p>
          {__("user::passwordRecoveryExplanation")}
        </p>
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
