var React = require("react");
var BSInput = require("react-bootstrap/Input");
var UserProfile = require("../classes/UserProfile");
var ajax = require("ajax");

var ProfileUpdateForm = React.createClass({
  propTypes: {
    profileData: React.PropTypes.object,
    previousEmail: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      profileData: {},
      previousEmail: null
    }
  },

  componentWillMount: function() {
    var self = this;
    var req = ajax.request(
      {endpoint: "/user/data/2"},
      function(err, res){
        if (err) {
          console.error(status, err.toString());
          return;
        }
        // use res object
        self.setState({profileData:res.body});
      }
    );
    //Keep original email saved to test for change
    self.props.previousEmail = self.state.profileData.email;
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
    //If email changed ,test if it is unique
    if(this.props.previousEmail !== this.state.profileData.email
        && !this.emailIsUnique(this.state.profileData.email)){
      //Someone is already using this email
      //Warn user
      return;
    }
    //Waiting until request API is completed
    //build new userprofil object
    //call update profile fonction
  },

  emailIsUnique: function(email){
    var self = this;
    var isUnique = false;
    var req = ajax.request( {endpoint: "/user/testEmail/" + email},
      function(err, res){
        if (err) {
          console.error(status, err.toString());
          return;
        }
        // use res object
        isUnique = res.body.isUnique;
      }
    );
    return isUnique;
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