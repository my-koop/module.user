var React = require("react");
var BSInput = require("react-bootstrap/Input");
var UserProfile = require("../classes/UserProfile");
var ajax = require("ajax");
var MKFormInputFactory = require("./FormInputFactory");

var updateFormProperties = UserProfile.FORM;

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
    //If email changed ,test for unicity
    //if new email unique
      //build new userprofil object
      //call update profile fonction
  },


  render: function() {
    var self = this;
    var userFormFields = updateFormProperties.map(function(formField,key){
        return (
          React.addons.cloneWithProps(
            MKFormInputFactory(formField.type,formField.properties,key),
            {
              valueLink: self.makeValueLink(formField.properties.name),
              defaultValue: self.state.profileData[formField.properties.name]
            })
        )
    });
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          {userFormFields}
          <BSInput type="submit" bsStyle="primary" value="Update Profile" />
        </form>
      </div>
    );
  }
});

module.exports = ProfileUpdateForm;