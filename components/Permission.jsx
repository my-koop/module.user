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
    var isCheckbox = typeof this.props.refPerm === "boolean";

    if (isCheckbox) {
      return (
        <form className="form-horizontal">
          <BSInput
            type="checkbox"
            label={inputLabel}
            wrapperClassName="col-md-4"
            checked={this.props.userPerm}
          />
        </form>
      );
    }

    return (
      <form className="form-horizontal">
        <BSInput
          type="number"
          label={inputLabel}
          labelClassName="col-md-4"
          wrapperClassName="col-md-4"
          value={this.props.userPerm}
        />
      </form>
    );
  }
});

module.exports = Permission;
