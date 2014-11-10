﻿var React                = require("react");
var PropTypes            = React.PropTypes;
var BSCol                = require("react-bootstrap/Col");
var BSTabbedArea         = require("react-bootstrap/TabbedArea");
var BSTabPane            = require("react-bootstrap/TabPane");
var MKPasswordChangeForm = require("./PasswordChangeForm");
var MKProfileUpdateForm  = require("./ProfileUpdateForm");
var __                   = require("language").__;

var MyAccountPage = React.createClass({

  render: function() {
    return (
      <BSCol>
        <BSTabbedArea defaultActiveKey={1}>
          <BSTabPane key={1} tab={__("user::myaccount_tab_profile")}>
            <BSCol md={4} sm={6}>
              <MKProfileUpdateForm />
            </BSCol>
          </BSTabPane>

          <BSTabPane key={2} tab={__("user::myaccount_tab_password")}>
            <BSCol md={4} sm={6}>
              <MKPasswordChangeForm />
            </BSCol>
          </BSTabPane>
        </BSTabbedArea>
      </BSCol>
    );
  }
});

module.exports = MyAccountPage;
