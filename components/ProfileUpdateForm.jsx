var React = require("react");
var BSInput = require("react-bootstrap/Input");
var UserProfile = require("../classes/UserProfile");
var ajax = require("ajax");
var actions = require("actions");
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
    //FIX ME: Get ID from SESSION
    actions.user.getProfile(
    {
      data: {
        id: 2
      }
    }, function(err,result){
        if(err) {
          //display error

        }
        self.setState({
          profileData : result.userProfile
        })
        //Additional treatment on

    });
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
    var self = this;
    //FIX ME Get ID From session
    var profileData = self.state.profileData;
    actions.user.updateProfile(
      {
        data: {
          id:             2,
          email:          profileData.email,
          firstname:      profileData.firstname,
          lastname:       profileData.lastname,
          phone:          profileData.phone,
          origin:         profileData.origin,
          birthdate:      profileData.birthdate,
          usageNote:      profileData.usageNote,
          usageFrequency: profileData.usage,
          referral:       profileData.referral
        }
      }, function(err, result){
           if(err || !result.updateSuccess){
            //Display error
            console.log(err);
           }
           //Display Success
           console.log(result);
      }
    );
  },


  render: function() {
    var self = this;
    return (
      <div>
        <form onSubmit={this.onSubmit}>
           <BSInput
                type="text"
                label="Firstname"
                placeholder="Firstname"
                autoFocus
                ref="firstname"
                valueLink = {this.makeValueLink("firstname")}
              />
              <BSInput
                type="text"
                label="lastname"
                placeholder="Last Name"
                ref="lastname"
                valueLink = {this.makeValueLink("lastname")}
              />
              <BSInput
                type="email"
                label="E-Mail"
                placeholder="E-Mail"
                ref="email"
                valueLink = {this.makeValueLink("email")}
              />
              <BSInput
                type="text"
                label="Phone Number"
                placeholder="Phone number"
                ref="phone"
                valueLink = {this.makeValueLink("phone")}
              />
              <BSInput
                type="text"
                label="Birthdate"
                placeholder="Birthdate (YYYY/MM/DD)"
                ref="Birthdate"
                valueLink = {this.makeValueLink("birthdate")}
              />
              <BSInput
                type="select"
                defaultValue="visit"
                label="How did you find us"
                valueLink={this.makeValueLink("referral")}
              >
                <option value="visit">On-Site Visit</option>
                <option value="friend">Friend referral</option>
                <option value="ads">Ads</option>
                <option value="other">Other</option>
              </BSInput>
              {this.state.profileData.referral === "other" ?
                <BSInput
                  type="text"
                  label="Please Specify"
                  valueLink={this.makeValueLink("referralSpecify")}
                />
              : null
              }
              <BSInput
                type="select"
                defaultValue="everyday"
                label="Bike usage"
                valueLink = {this.makeValueLink("usageFrequency")}
              >
                <option value="everyday">Every Day</option>
                <option value="fewWeek">Few times a week</option>
                <option value="fewMonth">Few times a month</option>
                <option value="fewYear">Few times a year</option>
                <option value="never">Never</option>
              </BSInput>
              <BSInput
                type="select"
                defaultValue="udem"
                label="Where do you come from?"
                valueLink = {this.makeValueLink("origin")}
              >
                <option value="udem">Université de Montréal</option>
                <option value="brebeuf">College Jean-De-Brébeuf</option>
                <option value="other">Other</option>
              </BSInput>
              <BSInput
                type="text"
                label="Why do you use a bike"
                placeholder="Describe why you mainly use your bike"
                valueLink = {this.makeValueLink("usageNote")}
              />
          <BSInput type="submit" bsStyle="primary" value="Update Profile" />
        </form>
      </div>
    );
  }
});

module.exports = ProfileUpdateForm;