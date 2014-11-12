﻿var React       = require("react");
var BSInput     = require("react-bootstrap/Input");
var UserProfile = require("../lib/classes/UserProfile");
var ajax        = require("ajax");
var actions     = require("actions");
var BSAlert     = require("react-bootstrap/Alert");
var __          = require("language").__;
var formatDate  = require("language").formatDate;

var ProfileUpdateForm = React.createClass({

  propTypes: {
    userId: React.PropTypes.number.isRequired,
    onIdValidated: React.PropTypes.func,
    // If provided, the save request will be for the current user session.
    current: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      current: false
    };
  },

  getInitialState: function() {
    return {
      profileData: {},
      message: null,
      messageStyle: null,
      emailStyle: null,
    }
  },

  getProfile: function(userId){
    var self = this;
    actions.user.getProfile(
      {
        data: {
          id: userId
        }
      },
      function(err,result){
        if(err) {
          if(self.props.onIdValidated) {
            self.props.onIdValidated(false);
          }
          return console.log(err);
        }
        var profile = result.userProfile;
        self.setState({
          profileData : profile,
        }, function() {
          if(self.props.onIdValidated) {
            self.props.onIdValidated(true);
          }
        }
      );
    });
  },

  componentWillReceiveProps: function(nextProps){
    if(nextProps.userId !== this.props.userId) {
      this.getProfile(nextProps.userId);
    }

  },

  componentWillMount: function() {
    this.getProfile(this.props.userId);
  },

  handleFieldChange: function(field, newValue) {
    var profile = this.state.profileData;
    profile[field] = newValue;
    this.setState({profileData: profile});
  },

  makeValueLink: function(field) {
    return {
      value: this.state.profileData[field],
      requestChange: this.handleFieldChange.bind(this, field)
    }
  },

  setMessage: function(Message, isError){
    var style = (isError) ? "warning" : "success";
    this.setState({
      message: Message,
      messageStyle: style
    })
  },

  onSubmit: function(e){
    e.preventDefault();
    var self = this;
    //Reset displayed message
    self.setMessage(null,false);
    var profileData = self.state.profileData;

    var action = self.props.current ?
      actions.user.current.updateProfile
      : actions.user.updateProfile;

    action(
      {
        data: {
          id:              self.props.userId,
          email:           profileData.email,
          firstname:       profileData.firstname,
          lastname:        profileData.lastname,
          phone:           profileData.phone,
          origin:          profileData.origin,
          birthdate:       profileData.birthdate,
          usageNote:       profileData.usageNote,
          usageFrequency:  profileData.usageFrequency,
          referral:        profileData.referral,
          referralSpecify: profileData.referralSpecify
        }
      },function(err, result){
          if(err || !result.updateSuccess){
            console.log(err);
            if(err.message == "Error: Duplicate Email"){
              self.setMessage(__("errors::error_duplicate_email") + profileData.email, isError = true);
              self.setState({
                emailStyle: "warning",
              });
            } else {
              self.setMessage(__("user::update_profile_failure_message"), isError = true);
            }
          } else {
            //Display Success
            self.setMessage(__("user::update_profile_success_message"), isError = false);
            self.setState({
              emailStyle: null
            });
          }
      }
    );
  },


  render: function() {
    var self = this;
    return (
      <div>
        {this.state.message ?
          <BSAlert bsStyle={this.state.messageStyle}>
            {this.state.message}
          </BSAlert>
        : null}
        <form onSubmit={this.onSubmit}>
          <BSInput
            type="email"
            label={__("user::form_profile_label_email")}
            placeholder={__("user::form_profile_placeholder_email")}
            ref="email"
            autofocus
            bsStyle={this.state.emailStyle}
            valueLink = {this.makeValueLink("email")}
          />
           <BSInput
            type="text"
            label={__("user::form_profile_label_firstname")}
            placeholder={__("user::form_profile_placeholder_firstname")}
            ref="firstname"
            valueLink = {this.makeValueLink("firstname")}
          />
          <BSInput
            type="text"
            label={__("user::form_profile_label_lastname")}
            placeholder={__("user::form_profile_placeholder_lastname")}
            ref="lastname"
            valueLink = {this.makeValueLink("lastname")}
          />
          <BSInput
            type="text"
            label={__("user::form_profile_label_phone")}
            placeholder={__("user::form_profile_placeholder_phone")}
            ref="phone"
            valueLink = {this.makeValueLink("phone")}
          />
          <BSInput
            type="text"
            label={__("user::form_profile_label_birthdate")}
            placeholder={__("user::form_profile_placeholder_birthdate")}
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
          {this.state.profileData.referral === "other" ?
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
            valueLink = {this.makeValueLink("usageNote")}
          />

          <BSInput
            type="submit"
            bsStyle="primary"
            value={__("user::update_profile_submit_button")} />
        </form>
      </div>
    );
  }
});

module.exports = ProfileUpdateForm;
