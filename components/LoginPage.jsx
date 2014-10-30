var React = require("react");
var BSPanel = require("react-bootstrap/Panel");
var MKLoginBox = require("./LoginBox");
var __ = require("language").__;

var LoginPage = React.createClass({

  render: function() {
    return (
      <BSPanel header={__("user::signin")} >
        <MKLoginBox />
      </BSPanel>
    );
  }
});

module.exports = LoginPage;
