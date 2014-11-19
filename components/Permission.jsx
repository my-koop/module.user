var React     = require("react");

var BSInput  = require("react-bootstrap/Input");

var __ = require("language").__;

function nameForPermission(permPath) {
  var i18nkey = "permissions::" + permPath.join(".");

  return __(i18nkey);
}

var Permission = React.createClass({
  render: function() {
    var inputLabel = nameForPermission(this.props.permPath);

    return (
      <BSInput
        type="number"
        label="Test"
      />
    );
  }
});

module.exports = Permission;
