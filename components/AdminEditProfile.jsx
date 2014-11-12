var React                = require("react");
var PropTypes            = React.PropTypes;
var BSGrid               = require("react-bootstrap/Grid");
var BSCol                = require("react-bootstrap/Col");
var BSRow                = require("react-bootstrap/Row");
var BSInput              = require("react-bootstrap/Input");
var MKProfileUpdateForm  = require("./ProfileUpdateForm");
var __                   = require("language").__;
var BSAlert              = require("react-bootstrap/Alert");

var AdminEditProfile = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      id : null,
      isValidId : null
    }
  },

  isValidId: function(isValid){
    this.setState({
      isValidID: isValid
    })
  },

  onSubmit: function(e){
    e.preventDefault();
  },

  render: function(){
    return (
      <BSGrid>
      <BSRow>
        <form onSubmit={this.onSubmit}>
          <BSCol xs={2}>
              <BSInput
                type="text"
                ref="id"
                valueLink={this.linkState("id")}
                placeholder={__("user::adminEditIdField")}
              />
          </BSCol>
          <BSCol xs={2}>
            <BSInput
              type="submit"
              bsStyle="primary"
              value={__("user::register_submit_button")}
            />
          </BSCol>
        </form>

      </BSRow>
      <BSRow>
      { this.state.isValidId ?
          <MKProfileUpdateForm userId={this.state.id} isValid={this.isValidId} />
        : <BSAlert bsStyle="warning">
            {__("user::adminEditInvalidID")}
          </BSAlert>
         }
      </BSRow>
      </BSGrid>

    );
  }
});

module.exports = AdminEditProfile;