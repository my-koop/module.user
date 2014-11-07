﻿var React       = require("react");
var BSPanel     = require("react-bootstrap/Panel");
var BSInput     = require("react-bootstrap/Input");
var BSAlert     = require("react-bootstrap/Alert");
var BSButton    = require("react-bootstrap/Button");
var BSAccordion = require("react-bootstrap/Accordion");
var Router      = require("react-router");
var routeData   = require("dynamic-metadata").routes;
var __          = require("language").__;
var actions     = require("actions");

var MKConfirmationTrigger = require("mykoop-core/components/ConfirmationTrigger");

// Variables used to traverse panels
var totalPanels = 3;
var panelsFirstField = [
  "firstname",
  "phone",
  "mailing1"
];


var RegisterPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function(){
    return {
      key: 0,
      success: 0,
      formData: {}
    };
  },

  // Indicate we sent a request and are waiting for a response
  pendingRequest: false,

  // Checks if we can send a new request to the server
  canSendRequest: function(){
    return !this.pendingRequest && !this.hasSentSuccessfully();
  },

  // Checks if we received a positive response from the server
  hasSentSuccessfully: function(){
    return this.state.success === 1;
  },

  onSubmit: function(e){
    e.preventDefault();
    this.refs.confirmationBox.show();
  },

  // Get message to display in the form (null = no message)
  getMessage: function(){
    switch(this.state.success){
    case 1: return "Successfully created profile, redirecting to homepage";
    case 2: return "Error(s) in form";
    default: return null;
    }
  },

  // Get style to use for message
  getMessageStyle: function(){
    switch(this.state.success){
    case 1: return "success";
    case 2: return "danger";
    default: return null;
    }
  },

  // Captures shift+tab & tab key to go up or down in the accordion
  checkGoingUpDownKey: function(e){
    if(e.shiftKey && e.keyCode === 9){
      this.previousPanel();
      e.preventDefault();
    } else if(e.keyCode === 9){
      this.nextPanel();
      e.preventDefault();
    }
  },

  // Captures shift+tab to go up in the accordion
  checkGoingUpKey: function(e){
    if(e.shiftKey && e.keyCode === 9){
      this.previousPanel();
      e.preventDefault();
    }
  },

  // Captures tab key to go down in the accordion
  checkGoingDownKey: function(e){
    if(!e.shiftKey && e.keyCode === 9){
      this.nextPanel();
      e.preventDefault();
    }
  },

  // Go to previous panel
  previousPanel: function(){
    var key = this.state.key ? this.state.key - 1 : totalPanels - 1;
    this.selectPanel(key);
  },

  // Go to next panel
  nextPanel: function(){
    this.selectPanel((this.state.key + 1) % totalPanels);
  },

  // Select an arbitrary panel
  selectPanel: function(key){
    this.setState({
      key: key
    }, function(){
      this.refs[panelsFirstField[key]].getInputDOMNode().focus();
    });
  },

  // Handler when clicking on a panel header in the accordion
  handleSelect: function(selectedKey) {
    this.selectPanel(selectedKey);
  },

  handleFieldChange: function(field, newValue) {
    var profile = this.state.formData;
    profile[field] = newValue;
    this.setState({formData: profile});
  },

  makeValueLink: function(field) {
    return {
      value: this.state.formData[field],
      requestChange: this.handleFieldChange.bind(this, field)
    }
  },

  submitForm: function(){
    var self = this;
    return function(){
      if( self.canSendRequest() && (self.pendingRequest = true) ){
        var formData = self.state.formData;
        actions.user.register({
          data: {
            email:          formData.email,
            firstname:      formData.firstname,
            lastname:       formData.lastname,
            phone:          formData.phone,
            origin:         formData.origin,
            birthday:       formData.birthdate,
            usageNote:      formData.usageNote,
            usageFrequency: formData.usage,
            referral:       formData.referral,
            passwordToHash: formData.password,
            confPassword:   formData.confpassword
          }
        },
        function (err, res) {
          var registerSuccess;
          if (err || res.registered !== 1) {
            console.error(err);
            registerSuccess = 0;
          } else {
            console.log(res);
            registerSuccess = 1;
          }

          self.setState({
            success: registerSuccess
          },
          function(){
            self.pendingRequest = false;
            if(self.hasSentSuccessfully()){
              // Redirect to homepage after 2 seconds
              setTimeout(function(){
                Router.transitionTo(routeData.public.name);
              },2000);
            }
          });
        });
      }
    }
  },

  render: function() {
    return (
      <BSPanel header="Register Form" >
        <form name="registerForm" onSubmit={this.onSubmit}>
          <BSAccordion activeKey={this.state.key} onSelect={this.handleSelect}>

            <BSPanel header="Account Info" key={0}>
              {this.state.success ?
                <BSAlert bsStyle={this.getMessageStyle()}>
                  {this.getMessage()}
                </BSAlert>
              : null}
              <BSInput
                type="text"
                label="Firstname"
                placeholder="Firstname"
                autoFocus
                // This must be in the array panelsFirstField
                ref="firstname"
                valueLink = {this.makeValueLink("firstname")}
                required
              />
              <BSInput
                type="text"
                label="Lastname"
                placeholder="Last Name"
                ref="lastname"
                valueLink = {this.makeValueLink("lastname")}
                required
              />
              <BSInput
                type="email"
                label="E-Mail"
                placeholder="E-Mail"
                ref="email"
                valueLink = {this.makeValueLink("email")}
                required
              />
              <BSInput
                type="password"
                label="Password"
                placeholder="Password"
                ref="password"
                valueLink = {this.makeValueLink("password")}
                required
              />
              <BSInput
                type="password"
                label="Confirm Password"
                placeholder="Confirm Password"
                ref="confpassword"
                valueLink = {this.makeValueLink("confpassword")}
                onKeyDown={this.checkGoingDownKey}
                required
              />
              <BSButton onClick={this.nextPanel} className="pull-right">Next</BSButton>
            </BSPanel>

            <BSPanel header="Optionnal Info" key={1}>
              <BSInput
                type="text"
                label="Phone Number"
                placeholder="Phone number"
                // This must be in the array panelsFirstField
                ref="phone"
                valueLink = {this.makeValueLink("phone")}
                onKeyDown={this.checkGoingUpKey}
              />
              <BSInput
                type="text"
                label="Birthdate"
                placeholder="Birthdate (YYYY/MM/DD)"
                valueLink = {this.makeValueLink("birthdate")}
                ref="birthdate"
              />
              <BSInput
                type="select"
                defaultValue="visit"
                label="How did you find us"
                valueLink={this.makeValueLink("referral")}
              >
                <option value="visit">On-Site Visit</option>
                <option value="friend">Friend referral</option>
                <option value="ads">Ads</option>
                <option value="other">Other</option>
              </BSInput>
              {this.state.formData.referral === "other" ?
                <BSInput
                  type="text"
                  label="Please Specify"
                  valueLink={this.makeValueLink("referralSpecify")}
                />
              : null
              }
              <BSInput
                type="select"
                defaultValue="everyday"
                label="Bike usage"
                ref="usage"
                valueLink = {this.makeValueLink("usage")}
              >
                <option value="everyday">Every Day</option>
                <option value="fewWeek">Few times a week</option>
                <option value="fewMonth">Few times a month</option>
                <option value="fewYear">Few times a year</option>
                <option value="never">Never</option>
              </BSInput>
              <BSInput
                type="select"
                defaultValue="udem"
                label="Your origin"
                ref="origin"
                valueLink = {this.makeValueLink("origin")}
              >
                <option value="udem">Université de Montréal</option>
                <option value="brebeuf">College Jean-De-Brébeuf</option>
                <option value="other">Other</option>
              </BSInput>
              <BSInput
                type="text"
                label="Why do you use a bike"
                placeholder="Describe why you mainly use your bike"
                ref="usageNote"
                onKeyDown={this.checkGoingDownKey}
                valueLink = {this.makeValueLink("usageNote")}
              />
              <BSButton onClick={this.nextPanel} className="pull-right">Next</BSButton>
            </BSPanel>

            <BSPanel header="Subscribe Options" key={2}>
              <BSInput
                type="checkbox"
                label="General Mailing List"
                ref="mailing1"
                onKeyDown={this.checkGoingUpKey}
              />
              <BSInput
                type="checkbox"
                label="Events Mailing List"
              />
            </BSPanel>

          </BSAccordion>
          <MKConfirmationTrigger
            message="Are you sure all the information is valid?"
            onYes={this.submitForm()}
            // This must be in the array panelsFirstField
            ref="confirmationBox"
          />
          <BSInput
            type="submit"
            bsStyle="primary"
            bsSize="large"
            value="Submit"
            className="pull-right"
          />
        </form>
      </BSPanel>
    );
  }
});

module.exports = RegisterPage;
