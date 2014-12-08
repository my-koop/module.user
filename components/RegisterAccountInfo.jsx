var React  = require("react");

var BSInput = require("react-bootstrap/Input");

var __ = require("language").__;
var _ = require("lodash");

var RegisterAccountInfo = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    checkGoingUpKey: React.PropTypes.func.isRequired,
    checkGoingDownKey: React.PropTypes.func.isRequired,
  },

  // Initialize state to avoid crashes if nothing is entered
  getInitialState: function() {
    return {
      fieldStates: {}
    };
  },

  stateKeys: ["firstname", "lastname", "email", "password", "confpassword"],

  getAccountInfo: function() {
    return {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      confpassword: this.state.confpassword,
    };
  },

  setValidationFeedback: function(errors) {
    //Field highlighting
    var fieldStates = {};
    _.intersection(this.stateKeys, _.keys(errors.app)).forEach(function(key) {
      fieldStates[key] = "error";
    })
    this.setState({
      fieldStates: fieldStates
    });
  },

  onEnterFocus: function() {
    this.refs.firstname.getInputDOMNode().focus();
  },

  render: function() {
    var self = this;

    return (
      <div>
        <BSInput
          type="text"
          label={__("user::form_profile_label_firstname")}
          placeholder={__("user::form_profile_placeholder_firstname")}
          autoFocus
          ref="firstname"
          valueLink = {this.linkState("firstName")}
          bsStyle={this.state.fieldStates.firstname || null}
          hasFeedback={!!this.state.fieldStates.firstname}
          onKeyDown={this.props.checkGoingUpKey}
          required
        />
        <BSInput
          type="text"
          label={__("user::form_profile_label_lastname")}
          placeholder={__("user::form_profile_placeholder_lastname")}
          valueLink = {this.linkState("lastName")}
          bsStyle={this.state.fieldStates.lastname || null}
          hasFeedback={!!this.state.fieldStates.lastname}
          required
        />
        <BSInput
          type="email"
          label={__("user::form_profile_label_email")}
          placeholder={__("user::form_profile_placeholder_email")}
          valueLink = {this.linkState("email")}
          bsStyle={this.state.fieldStates.email || null}
          hasFeedback={!!this.state.fieldStates.email}
          required
        />
        <BSInput
          type="password"
          label={__("user::form_profile_label_password")}
          placeholder={__("user::form_profile_placeholder_password")}
          valueLink = {this.linkState("password")}
          bsStyle={this.state.fieldStates.password || null}
          hasFeedback={!!this.state.fieldStates.password}
          required
        />
        <BSInput
          type="password"
          label={__("user::form_profile_label_conf_password")}
          placeholder={__("user::form_profile_placeholder_conf_password")}
          valueLink = {this.linkState("confpassword")}
          bsStyle={this.state.fieldStates.confpassword || null}
          hasFeedback={!!this.state.fieldStates.confpassword}
          onKeyDown={this.props.checkGoingDownKey}
          required
        />
     </div>
    );
  }
});

module.exports = RegisterAccountInfo;
