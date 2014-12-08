var React  = require("react");

var BSInput = require("react-bootstrap/Input");

var MKDateTimePicker = require("mykoop-core/components/DateTimePicker");
var MKAlert               = require("mykoop-core/components/Alert");
var __ = require("language").__;

var RegisterOptionalInfo = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    checkGoingUpKey: React.PropTypes.func.isRequired,
    checkGoingDownKey: React.PropTypes.func.isRequired,
  },

  stateKeys: [
    "phone",
    "birthdate",
    "referral",
    "referralSpecify",
    "usageFrequency",
    "origine",
    "usageNote"
  ],

  // Initialize state to avoid crashes if nothing is entered
  getInitialState: function() {
    return {
      fieldStates: {},
      message: null
    };
  },

  getOptionalInfo: function() {
    return {
      phone: this.state.phone,
      birthdate: this.state.birthdate,
      referral: this.state.referral,
      referralSpecify: this.state.referralSpecify,
      usageFrequency: this.state.usageFrequency,
      origine: this.state.origine,
      usageNote: this.state.usageNote
    };
  },

  onEnterFocus: function() {
    this.refs.phone.getInputDOMNode().focus();
  },

  setValidationFeedback: function(errors) {
    //Getting all localised error messages
    var message = _.map(errors.i18n, function(locales){
      return (
        <p> { __(locales.key) } </p>
      );
    });

    //Field highlighting
    var fieldStates = {};
    _.intersection(this.stateKeys, _.keys(errors.app)).forEach(function(key){
      fieldStates[key] = "error";
    })
    this.setState({
      fieldStates: fieldStates,
      message: message
    })
  },

  render: function() {
    var self = this;

    return (
      <div>
        <MKAlert bsStyle="warning">
          {this.state.message}
        </MKAlert>
        <BSInput
          type="text"
          label={__("user::form_profile_label_phone")}
          placeholder={__("user::form_profile_placeholder_phone")}
          ref="phone"
          valueLink = {this.linkState("phone")}
          bsStyle={this.state.fieldStates.phone || null}
          onKeyDown={this.props.checkGoingUpKey}
        />
        <label htmlFor="birthdatePicker">
          {__("user::form_profile_label_birthdate")}
        </label>,
        <MKDateTimePicker
          id="birthdatePicker"
          value={this.state.birthdate}
          time={false}
          format="M/d/yyyy"
          onChange={function(date, str) {
            self.setState({
              birthdate: date
            });
          }}
        />
        <BSInput
          type="select"
          defaultValue="visit"
          label={__("user::form_profile_label_visit_select")}
          bsStyle={this.state.fieldStates.referral || null}
          valueLink={this.linkState("referral")}
        >
          <option value="visit">{__("user::form_profile_select_option_visit")}</option>
          <option value="friend">{__("user::form_profile_select_option_friend")}</option>
          <option value="ads">{__("user::form_profile_select_option_ads")}</option>
          <option value="other">{__("user::form_profile_select_option_other")}</option>
        </BSInput>
        {this.state.referral === "other" ?
          <BSInput
            type="text"
            label={__("user::form_profile_label_referralSpecify")}
            bsStyle={this.state.fieldStates.referralSpecify || null}
            valueLink={this.linkState("referralSpecify")}
          />
        : null
        }
        <BSInput
          type="select"
          defaultValue="everyday"
          label={__("user::form_profile_label_usage_select")}
          valueLink = {this.linkState("usageFrequency")}
          bsStyle={this.state.fieldStates.usageFrequency || null}
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
          valueLink = {this.linkState("origin")}
          bsStyle={this.state.fieldStates.origine || null}
        >
          <option value="udem">{__("user::form_profile_select_option_udem")}</option>
          <option value="brebeuf">{__("user::form_profile_select_option_brebeuf")}</option>
          <option value="other">{__("user::form_profile_select_option_other")}</option>
        </BSInput>
        <BSInput
          type="text"
          label={__("user::form_profile_label_usageNote")}
          placeholder={__("user::form_profile_placeholder_usageNote")}
          onKeyDown={this.props.checkGoingDownKey}
          valueLink = {this.linkState("usageNote")}
          bsStyle={this.state.fieldStates.usageNote || null}
        />
     </div>
    );
  }
});

module.exports = RegisterOptionalInfo;
