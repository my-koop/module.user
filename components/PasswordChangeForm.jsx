var React   = require("react/addons");
var BSInput = require("react-bootstrap/Input");
var BSAlert = require("react-bootstrap/Alert");
var actions = require("actions");
var __      = require("language").__;

var PasswordChangeForm = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function(){
    return {
      message: null,
      hasMessageError: false,
      hasNewPwdError: false,
      hasConfirmPwdError: false,
      hasOldPwdError: false
    };
  },

  requestFeedback: function(error){
    var formState = {
      message: null,
      hasMessageError: false,
      hasNewPwdError: false,
      hasConfirmPwdError: false,
      hasOldPwdError: false
    };

    if(error){
      console.error(error);
      if(error.context === "validation"){
        if(error.validation.newPassword === "New password must be different from current password"){
            formState.message = __("errors::validation_new_password_equals_old");
            formState.hasNewPwdError = true;
         }
         if(error.validation.confNewPassword === "New passwords must match"){
            formState.message = __("errors::validation_confpassword_mismatch");
            formState.hasConfirmPwdError = true;
         }
         if(error.validation.oldPassword
            && error.validation.newPassword
            && error.validation.confNewPassword) {
           formState.message = __("errors::validation_fill_all");
           formState.hasOldPwdError = true;
           formState.hasNewPwdError = true;
           formState.hasConfirmPwdError = true;
         }
      } else if (error.context === "application") {
        formState.message = __("errors::validation_wrong_password");
        formState.hasOldPwdError = true;
      } else {
        formState.message = __("errors::error_unable_to_update");
      }
      formState.hasMessageError = true;
    } else {
      formState.message = __("user::update_password_success");
    }
    this.setState(formState);
  },

  onSubmit: function(e){
    e.preventDefault();
    var self = this;
    //FIX ME: Get ID from SESSION
    actions.user.updatePassword({
      data: {
        id:              2,
        oldPassword:     this.state.oldPassword,
        newPassword:     this.state.password,
        confNewPassword: this.state.passwordRepeat
      }
    }, function(err) {
        self.requestFeedback(err);
    });

  },

  getMessageStyle: function(){
    return (this.state.hasMessageError && "danger") || "success";
  },

  getOldPwdStyle: function(){
    return (this.state.hasOldPwdError && "error") || null;
  },

  getNewPwdStyle: function(){
    return (this.state.hasNewPwdError && "error") || null;
  },

  getConfPwdStyle: function(){
    return (this.state.hasConfirmPwdError && "error") || null;
  },

  render: function() {
    return (
      <div>
        {this.state.message ?
          <BSAlert bsStyle={this.getMessageStyle()}>
            {this.state.message}
          </BSAlert>
        : null}
        <form onSubmit={this.onSubmit}>
          <BSInput
            type="password"
            label={__("user::field_old_password")}
            bsStyle={this.getOldPwdStyle()}
            valueLink={this.linkState("oldPassword")}
          />
          <BSInput
            type="password"
            label={__("user::field_new_password")}
            valueLink={this.linkState("password")}
            bsStyle={this.getNewPwdStyle()}
            hasFeedback
          />
          <BSInput
            type="password"
            label={__("user::field_conf_new_password")}
            valueLink={this.linkState("passwordRepeat")}
            bsStyle={this.getConfPwdStyle()}
            hasFeedback
          />
          <BSInput
            type="submit"
            bsStyle="primary"
            value={__("user::field_update_password_submit")} />
        </form>
      </div>
    );
  }
});

module.exports = PasswordChangeForm;
