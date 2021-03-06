﻿var React = require("react");
var BSButton = require("react-bootstrap/Button");
var MKAbstractModal = require("mykoop-core/components/AbstractModal");
var MKLoginBox = require("./LoginBox");
var __  = require("language").__;

var loginState = {};
var saveLoginState = function(state){
  loginState = state;
};

var onLoginSuccess = function(){
  console.log("success");
};

var LoginTitle  = __("user::signin");

var LoginModal = React.createClass({
  render: function () {
    var LoginBody = (
      <MKLoginBox
        state={loginState}
        saveStateCallback={saveLoginState}
        onLoginSuccess={this.props.onRequestHide}
        onRedirect={this.props.onRequestHide}
      />
    );

    return this.transferPropsTo(
      <MKAbstractModal
        bsSize="small"
        title={LoginTitle}
        modalBody={LoginBody}
        useCloseButtonFooter
      />
    );
  }
});

module.exports = LoginModal;
