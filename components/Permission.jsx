var React     = require("react");

var BSInput  = require("react-bootstrap/Input");

var Permission = React.createClass({
  render: function() {
    return (
      <BSInput
        type="number"
        label="Test"
      />
    );
  }
});

module.exports = Permission;
