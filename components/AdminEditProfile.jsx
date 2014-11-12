var React     = require("react");

var BSGrid   = require("react-bootstrap/Grid");
var BSCol    = require("react-bootstrap/Col");
var BSRow    = require("react-bootstrap/Row");
var BSInput  = require("react-bootstrap/Input");
var BSAlert  = require("react-bootstrap/Alert");
var BSButton = require("react-bootstrap/Button");

var MKProfileUpdateForm = require("./ProfileUpdateForm");

var __                   = require("language").__;

var AdminEditProfile = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      id : null,
      isValidId : false,
      firstIdSet: false
    }
  },

  onIdValidated: function(isValid){
    if(!isValid) {
      this.setState({
        isValidId: false
      });
    }
  },

  setId: function(){
    var id = parseInt(this.state.selectedId);
    this.setState({
      id: id,
      selectedId: id,
      isValidId: true,
      firstIdSet: true
    });
  },

  render: function() {
    var content = null;
    if(this.state.firstIdSet) {
      if(this.state.isValidId) {
        content = <MKProfileUpdateForm userId={this.state.id} onIdValidated={this.onIdValidated} />;
      } else {
        content = (
          <BSAlert bsStyle="warning">
            {__("user::adminEditInvalidID")}
          </BSAlert>
        );
      }
    }

    return (
      <BSGrid>
      <BSRow>
        <BSCol md={2} xs={6}>
          <BSInput
            type="text"
            ref="id"
            valueLink={this.linkState("selectedId")}
            placeholder={__("user::adminEditIdField")}
          />
        </BSCol>
        <BSCol md={2} xs={6}>
          <BSButton
            bsStyle="primary"
            onClick={this.setId}
          >
            {__("user::register_submit_button")}
          </BSButton>
        </BSCol>
      </BSRow>
      <BSRow>
      {content}
      </BSRow>
    </BSGrid>
    );
  }
});

module.exports = AdminEditProfile;