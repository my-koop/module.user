var React  = require("react");

var BSInput = require("react-bootstrap/Input");

var __ = require("language").__;

var RegisterAccountInfo = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    checkGoingUpKey: React.PropTypes.func.isRequired,
    checkGoingDownKey: React.PropTypes.func.isRequired,
  },

  // Initialize state to avoid crashes if nothing is entered
  getInitialState: function() {
    return {};
  },

  getAccountInfo: function() {
    return {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      confpassword: this.state.confpassword,
    };
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
          onKeyDown={this.props.checkGoingUpKey}
          required
        />
        <BSInput
          type="text"
          label={__("user::form_profile_label_lastname")}
          placeholder={__("user::form_profile_placeholder_lastname")}
          valueLink = {this.linkState("lastName")}
          required
        />
        <BSInput
          type="email"
          label={__("user::form_profile_label_email")}
          placeholder={__("user::form_profile_placeholder_email")}
          valueLink = {this.linkState("email")}
          required
        />
        <BSInput
          type="password"
          label={__("user::form_profile_label_password")}
          placeholder={__("user::form_profile_placeholder_password")}
          valueLink = {this.linkState("password")}
          required
        />
        <BSInput
          type="password"
          label={__("user::form_profile_label_conf_password")}
          placeholder={__("user::form_profile_placeholder_conf_password")}
          valueLink = {this.linkState("confpassword")}
          onKeyDown={this.props.checkGoingDownKey}
          required
        />
     </div>
    );
  }
});

module.exports = RegisterAccountInfo;
