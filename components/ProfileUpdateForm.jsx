var React = require("react");
var BSInput = require("react-bootstrap/Input");
var UserProfile = require("../classes/UserProfile");
var ajax = require("ajax");

var ProfileUpdateForm = React.createClass({
  propTypes: {
    profileData: React.PropTypes.object,
  },

  getInitialState: function() {
    return {
      profileData: {},
    }
  },

  componentWillMount: function() {
    var self = this;
    //FIX ME: Get user profile from id  - Replace ajax call with proper action channel
    //Keep original email saved to test if it changed
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

  onSubmit: function(e){
    e.preventDefault();
    //FIX ME: Complete update steps
    //build new userprofil object
    //call update profile fonction
  },


  render: function() {
    var self = this;
    return (
      <div>
        <form onSubmit={this.onSubmit}>
           //FIX ME : Add static profile form
          <BSInput type="submit" bsStyle="primary" value="Update Profile" />
        </form>
      </div>
    );
  }
});

module.exports = ProfileUpdateForm;