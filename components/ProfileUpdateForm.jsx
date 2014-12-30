var React = require("react");

var BSInput = require("react-bootstrap/Input");
var BSCol   = require("react-bootstrap/Col");

var UserProfile = require("../lib/classes/UserProfile");

var MKAlert          = require("mykoop-core/components/Alert");
var MKDateTimePicker = require("mykoop-core/components/DateTimePicker");
var MKPermissionSet  = require("./PermissionSet");

var formatDate  = require("language").formatDate;
var actions     = require("actions");
var _           = require("lodash");
var __          = require("language").__;

var ProfileUpdateForm = React.createClass({

  propTypes: {
    userId: React.PropTypes.number.isRequired,
    profile: React.PropTypes.shape({
      email: React.PropTypes.string.isRequired,
      firstname: React.PropTypes.string,
      lastname: React.PropTypes.string,
      birthdate: React.PropTypes.Date,
      phone: React.PropTypes.string,
      origin: React.PropTypes.string,
      referral: React.PropTypes.string,
      referralSpecify: React.PropTypes.string,
      usageFrequency: React.PropTypes.string,
      usageNote: React.PropTypes.string
    }).isRequired,
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
      profileData: this.props.profile,
      fieldStyles: {},
      message: null,
      messageStyle: null
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if(nextProps.userId !== this.props.userId) {
      this.setState({
        profileData: nextProps.profile
      });
    }
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

  setMessage: function(Message, isError) {
    var style = (isError) ? "warning" : "success";
    this.setState({
      message: Message,
      messageStyle: style
    })
  },

  processValidationErrors: function(errors) {
    var fieldStyles = {};
    var message = _.map(errors, function(errorString, i) {
      var split = errorString.split(":");
      fieldStyles[split[0]] = "error";
      return (
        <p key={i}>
          { __("user::" + split[1])}
        </p>
        ) ;
    });
    this.setMessage(message, isError = true);
    this.setState({
      fieldStyles: fieldStyles
    });
  },

  requestFeedback: function(err) {
    this.setState({
      fieldStyles: {}
    });
    if(err) {
      if(err.context === "validation") {
          this.processValidationErrors(err.validation);
      } else if(err.context == "application" && err.app.email == "duplicate") {
        this.setMessage(__("errors::error_duplicate_email") + this.state.profileData.email, isError = true);
        var fieldStyles = {};
        fieldStyles.email = "error";
        this.setState({
          fieldStyles: fieldStyles,
        });
      } else {
        this.setMessage(__("user::update_profile_failure_message"), isError = true);
      }
    } else {
      //Display Success
      this.setMessage(__("user::update_profile_success_message"),isError = false);
    }
  },

  onSubmit: function(e) {
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
      },function(err, result) {
          self.requestFeedback(err);
      }
    );
  },


  render: function() {
    var self = this;
    return (
      <BSCol md={6}>
        <MKAlert bsStyle={this.state.messageStyle} key="feedback">
          {this.state.message}
        </MKAlert>
        <form onSubmit={this.onSubmit}>
          <BSInput
            type="email"
            label={__("user::form_profile_label_email")}
            placeholder={__("user::form_profile_placeholder_email")}
            key="email"
            autofocus
            bsStyle={this.state.fieldStyles.email || null}
            hasFeedback={!!this.state.fieldStyles.email}
            valueLink = {this.makeValueLink("email")}
          />
           <BSInput
            type="text"
            label={__("user::form_profile_label_firstname")}
            placeholder={__("user::form_profile_placeholder_firstname")}
            key="firstname"
            bsStyle={this.state.fieldStyles.firstname}
            hasFeedback={!!this.state.fieldStyles.firstname}
            valueLink = {this.makeValueLink("firstname")}
          />
          <BSInput
            type="text"
            label={__("user::form_profile_label_lastname")}
            placeholder={__("user::form_profile_placeholder_lastname")}
            key="lastname"
            bsStyle={this.state.fieldStyles.lastname}
            hasFeedback={!!this.state.fieldStyles.lastname}
            valueLink = {this.makeValueLink("lastname")}
          />
          <BSInput
            type="text"
            label={__("user::form_profile_label_phone")}
            placeholder={__("user::form_profile_placeholder_phone")}
            key="phone"
            bsStyle={this.state.fieldStyles.phone}
            hasFeedback={!!this.state.fieldStyles.phone}
            valueLink = {this.makeValueLink("phone")}
          />
          <label htmlFor="birthdatePicker" key="birthdateLabel">
            {__("user::form_profile_label_birthdate")}
          </label>,
          <MKDateTimePicker
            className="form-group"
            id="birthdatePicker"
            value={this.state.profileData.birthdate}
            key="birthdatePicker"
            time={false}
            format="M/d/yyyy"
            onChange={function(date, str) {
              self.handleFieldChange("birthdate", date);
            }}
          />
          <BSInput
            type="select"
            defaultValue="visit"
            key="referral"
            label={__("user::form_profile_label_visit_select")}
            valueLink={this.makeValueLink("referral")}
            bsStyle={this.state.fieldStyles.referral}
            hasFeedback={!!this.state.fieldStyles.referral}
          >
            <option value="visit">{__("user::form_profile_select_option_visit")}</option>
            <option value="friend">{__("user::form_profile_select_option_friend")}</option>
            <option value="ads">{__("user::form_profile_select_option_ads")}</option>
            <option value="other">{__("user::form_profile_select_option_other")}</option>
          </BSInput>
          {this.state.profileData.referral === "other" ?
            <BSInput
              type="text"
              key="referralSpecify"
              label={__("user::form_profile_label_referralSpecify")}
              bsStyle={this.state.fieldStyles.referralSpecify}
              hasFeedback={!!this.state.fieldStyles.referralSpecify}
              valueLink={this.makeValueLink("referralSpecify")}
            />
          : null
          }
          <BSInput
            type="select"
            defaultValue="everyday"
            label={__("user::form_profile_label_usage_select")}
            key="usage"
            valueLink = {this.makeValueLink("usageFrequency")}
            bsStyle={this.state.fieldStyles.usageFrequency}
            hasFeedback={!!this.state.fieldStyles.usageFrequency}
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
            key="origin"
            valueLink = {this.makeValueLink("origin")}
            bsStyle={this.state.fieldStyles.origin}
            hasFeedback={!!this.state.fieldStyles.origin}
          >
            <option value="udem">{__("user::form_profile_select_option_udem")}</option>
            <option value="brebeuf">{__("user::form_profile_select_option_brebeuf")}</option>
            <option value="other">{__("user::form_profile_select_option_other")}</option>
          </BSInput>
          <BSInput
            type="text"
            label={__("user::form_profile_label_usageNote")}
            placeholder={__("user::form_profile_placeholder_usageNote")}
            key="usageNote"
            valueLink = {this.makeValueLink("usageNote")}
            bsStyle={this.state.fieldStyles.usageNote}
            hasFeedback={!!this.state.fieldStyles.usageNote}
          />
          <BSInput
            type="submit"
            className="pull-right"
            key="submit"
            bsStyle="success"
            value={__("user::update_profile_submit_button")} />
        </form>
      </BSCol>
    );
  }
});

module.exports = ProfileUpdateForm;
