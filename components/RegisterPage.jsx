var React                 = require("react");
var BSPanel               = require("react-bootstrap/Panel");
var BSInput               = require("react-bootstrap/Input");
var BSAlert               = require("react-bootstrap/Alert");
var BSButton              = require("react-bootstrap/Button");
var BSAccordion           = require("react-bootstrap/Accordion");
var Router                = require("react-router");
var routeData             = require("dynamic-metadata").routes;
var __                    = require("language").__;
var actions               = require("actions");
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
    case 1: return __("user::register_success_message");
    case 2: return __("user::register_failure_message");
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
      <BSPanel header={__("user::register_panel_header")} >
        <form name="registerForm" onSubmit={this.onSubmit}>
          <BSAccordion activeKey={this.state.key} onSelect={this.handleSelect}>

            <BSPanel header={__("user::register_header_acc_info")} key={0}>
              {this.state.success ?
                <BSAlert bsStyle={this.getMessageStyle()}>
                  {this.getMessage()}
                </BSAlert>
              : null}
              <BSInput
                type="text"
                label={__("user::form_profile_label_firstname")}
                placeholder={__("user::form_profile_placeholder_firstname")}
                autoFocus
                // This must be in the array panelsFirstField
                ref="firstname"
                valueLink = {this.makeValueLink("firstname")}
                required
              />
              <BSInput
                type="text"
                label={__("user::form_profile_label_lastname")}
                placeholder={__("user::form_profile_placeholder_lastname")}
                ref="lastname"
                valueLink = {this.makeValueLink("lastname")}
                required
              />
              <BSInput
                type="email"
                label={__("user::form_profile_label_email")}
                placeholder={__("user::form_profile_placeholder_email")}
                ref="email"
                valueLink = {this.makeValueLink("email")}
                required
              />
              <BSInput
                type="password"
                label={__("user::form_profile_label_password")}
                placeholder={__("user::form_profile_placeholder_password")}
                ref="password"
                valueLink = {this.makeValueLink("password")}
                required
              />
              <BSInput
                type="password"
                label={__("user::form_profile_label_conf_password")}
                placeholder={__("user::form_profile_placeholder_conf_password")}
                ref="confpassword"
                valueLink = {this.makeValueLink("confpassword")}
                onKeyDown={this.checkGoingDownKey}
                required
              />
              <BSButton
                onClick={this.nextPanel}
                className="pull-right"
              >
                {__("user::register_panel_next")}
              </BSButton>
            </BSPanel>

            <BSPanel header={__("user::register_header_opt_info")} key={1}>
              <BSInput
                type="text"
                label={__("user::form_profile_label_phone")}
                placeholder={__("user::form_profile_placeholder_phone")}
                // This must be in the array panelsFirstField
                ref="phone"
                valueLink = {this.makeValueLink("phone")}
                onKeyDown={this.checkGoingUpKey}
              />
              <BSInput
                type="text"
                label={__("user::form_profile_label_birthdate")}
                placeholder={__("user::form_profile_placeholder_bidthdate")}
                valueLink = {this.makeValueLink("birthdate")}
                ref="birthdate"
              />
              <BSInput
                type="select"
                defaultValue="visit"
                label={__("user::form_profile_label_visit_select")}
                valueLink={this.makeValueLink("referral")}
              >
                <option value="visit">{__("user::form_profile_select_option_visit")}</option>
                <option value="friend">{__("user::form_profile_select_option_friend")}</option>
                <option value="ads">{__("user::form_profile_select_option_ads")}</option>
                <option value="other">{__("user::form_profile_select_option_other")}</option>
              </BSInput>
              {this.state.formData.referral === "other" ?
                <BSInput
                  type="text"
                  label={__("user::form_profile_label_referralSpecify")}
                  valueLink={this.makeValueLink("referralSpecify")}
                />
              : null
              }
              <BSInput
                type="select"
                defaultValue="everyday"
                label={__("user::form_profile_label_usage_select")}
                ref="usage"
                valueLink = {this.makeValueLink("usage")}
              >
                <option value="everyday">{__("user::form_profile_select_option_everyday")}</option>
                <option value="fewWeek">{__("user::form_profile_select_option_fewWeek")}</option>
                <option value="fewMonth">{__("user::form_profile_select_option_fewMonth")}</option>
                <option value="fewYear">{__("user::form_profile_select_option_fewYear")}</option>
                <option value="never">{__("user::form_profile_select_option_never")}</option>
              </BSInput>
              <BSInput
                type="select"
                defaultValue="udem"
                label={__("user::form_profile_label_origin_select")}
                ref="origin"
                valueLink = {this.makeValueLink("origin")}
              >
                <option value="udem">{__("user::form_profile_select_option_udem")}</option>
                <option value="brebeuf">{__("user::form_profile_select_option_brebeuf")}</option>
                <option value="other">{__("user::form_profile_select_option_other")}</option>
              </BSInput>
              <BSInput
                type="text"
                label={__("user::form_profile_label_usageNote")}
                placeholder={__("user::form_profile_placeholder_usageNote")}
                ref="usageNote"
                onKeyDown={this.checkGoingDownKey}
                valueLink = {this.makeValueLink("usageNote")}
              />
              <BSButton
                onClick={this.nextPanel}
                className="pull-right"
              >
                {__("user::register_panel_next")}
              </BSButton>
            </BSPanel>

            <BSPanel header={__("user::register_header_sub_info")} key={2}>
              <BSInput
                type="checkbox"
                label={__("user::form_profile_mailing_general")}
                ref="mailing1"
                onKeyDown={this.checkGoingUpKey}
              />
              <BSInput
                type="checkbox"
                label={__("user::form_profile_mailing_events")}
                ref="mailing2"
              />
            </BSPanel>

          </BSAccordion>
          <MKConfirmationTrigger
            message={__("user::register_trigger_message")}
            onYes={this.submitForm()}
            // This must be in the array panelsFirstField
            ref="confirmationBox"
          />
          <BSInput
            type="submit"
            bsStyle="primary"
            bsSize="large"
            value={__("user::register_submit_button")}
            className="pull-right"
          />
        </form>
      </BSPanel>
    );
  }
});

module.exports = RegisterPage;
