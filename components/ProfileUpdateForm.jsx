var React = require("react");
var BSInput = require("react-bootstrap/Input");
var UserProfile = require("../classes/UserProfile");
var ajax = require("ajax");

var ProfileUpdateForm = React.createClass({
  propTypes: {
    profileData: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      profileData: {}
    }
  },

  componentWillMount: function() {
    var self = this;
    var itemsData = ajax.request(
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
  },

  onSubmit: function(e){
    e.preventDefault();
    //If email changed ,test for unicity
    //if new email unique
      //build new userprofil object
      //call update profile fonction
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

  render: function() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <BSInput
            type="email"
            label="E-Mail"
            valueLink={this.makeValueLink("email")}
          />
          <BSInput
            type="text"
            label="First Name"
            defaultValue={this.state.profileData.firstname}
          />
          <BSInput
            type="text"
            label="Last Name"
            defaultValue={this.state.profileData.lastname}
          />
          <BSInput
            type="text"
            label="Birthdate"
            defaultValue={this.state.profileData.birthdate}
          />
          <BSInput
            type="text"
            label="Phone"
            defaultValue={this.state.profileData.phone}
          />
          <BSInput
            type="text"
            label="Origin"
            defaultValue={this.state.profileData.origin}
          />
          <BSInput type="submit" bsStyle="primary" value="Update Profile" />
        </form>
      </div>
    );
  }
});

module.exports = ProfileUpdateForm;