var React                = require("react");
var PropTypes            = React.PropTypes;
var BSGrid               = require("react-bootstrap/Grid");
var BSCol                = require("react-bootstrap/Col");
var BSRow                = require("react-bootstrap/Row");
var MKProfileUpdateForm  = require("./ProfileUpdateForm");
var __                   = require("language").__;


var AdminEditProfile = React.createClass({



  onSubmit: function(e){
    e.preventDefault();

  }

  render: function(){
    return (
      <form onSubmit={this.onSubmit}>
        <BSGrid>
          <BSRow>
            <BSCol>
                <BSInput
                  type="text"
                  ref="id"
                  label={__("user::adminEditIdField")}
                />
            </BSCol>
            <BSCol>
              <BSInput
                type="submit"
                bsStyle="primary"
                value={__("user::register_submit_button")}
              />
            </BSCol>
          </BSRow>
        </BSGrid>
      </form>
    );
  }
});

module.export = AdminEditProfile;