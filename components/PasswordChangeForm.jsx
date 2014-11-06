﻿var React = require("react/addons");
var BSInput = require("react-bootstrap/Input");
var BSAlert = require("react-bootstrap/Alert");
var actions = require("actions");

var PasswordChangeForm = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function(){
    return {
      message: null,
      hasMessageError: false,
      hasNewPwdError: false,
      hasConfirmPwdError: false
    };
  },

  onSubmit: function(e){
    e.preventDefault();
    var self = this;
    var formState = {
      message: null,
      hasMessageError: false,
      hasNewPwdError: false,
      hasConfirmPwdError: false
    };
     //Fix ME : Password Validation will be shared between front/backend in a common file
    if(!this.state.password || !this.state.passwordRepeat || !this.state.oldPassword){
      formState.message = "All fields must be filled";
      formState.hasMessageError = true;

    } else if(this.state.password === this.state.oldPassword){
      formState.message = "New password cannot be the same as the old one";
      formState.hasMessageError = true;
      formState.hasNewPwdError = true;

    } else if(this.state.password !== this.state.passwordRepeat){
      formState.message = "Password confirmation doesn't match";
      formState.hasMessageError = true;
      formState.hasConfirmPwdError = true;

    }
    this.setState(formState);
    if(formState.hasMessageError){
      //Validation error, stop request
      return;
    } else {
      //Send request down the chain

      //FIX ME: Get ID from SESSION
      actions.user.updatePassword({
        data: {
          id:              2,
          oldPassword:     this.state.oldPassword,
          newPassword:     this.state.password,
          confNewPassword: this.state.passwordRepeat
        }
      }, function(err, res) {
           if(err) {
             console.error(err);
             return;
           }
           if(!res.updateSuccess){
             formState.message = "Current password is incorrect."
             formState.hasConfirmPwdError = false;
             formState.hasNewPwdError = false;
             formState.hasMessageError = true;
           } else {
             formState.message = "Password updated successfully"
             formState.hasMessageError = false;
             formState.hasConfirmPwdError = false;
             formState.hasNewPwdError = false;
           }
           self.setState(formState);

      });
    }
  },

  getMessageStyle: function(){
    return (this.state.hasMessageError && "danger") || "success";
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
            label="Old Password"
            valueLink={this.linkState("oldPassword")}
          />
          <BSInput
            type="password"
            label="New Password"
            valueLink={this.linkState("password")}
            bsStyle={this.getNewPwdStyle()}
            hasFeedback
          />
          <BSInput
            type="password"
            label="Confirm Password"
            valueLink={this.linkState("passwordRepeat")}
            bsStyle={this.getConfPwdStyle()}
            hasFeedback
          />
          <BSInput type="submit" bsStyle="primary" value="Update Password" />
        </form>
      </div>
    );
  }
});

module.exports = PasswordChangeForm;
