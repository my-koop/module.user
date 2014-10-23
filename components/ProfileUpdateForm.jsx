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
            type="text"
            label="E-Mail"
            valueLink={this.makeValueLink("email")}
          />
          <BSInput
            type="text"
            label="First Name"
             valueLink={this.makeValueLink("firstname")}
          />
          <BSInput
            type="text"
            label="Last Name"
             valueLink={this.makeValueLink("lastname")}
          />
          <BSInput
            type="text"
            label="Birthdate"
             valueLink={this.makeValueLink("birthdate")}
          />
          <BSInput
            type="text"
            label="Phone"
             valueLink={this.makeValueLink("phone")}
          />
          <BSInput
            type="text"
            label="Origin"
             valueLink={this.makeValueLink("origin")}
          />
          <BSInput type="submit" bsStyle="primary" value="Update Profile" />
        </form>
      </div>
    );
  }
});

module.exports = ProfileUpdateForm;