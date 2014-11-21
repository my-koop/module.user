var React     = require("react");

var BSCol  = require("react-bootstrap/Col");
var BSRow  = require("react-bootstrap/Row");
var BSInput  = require("react-bootstrap/Input");

var __ = require("language").__;

function nameForPermission(permPath) {
  var i18nkey = "permissions::" + permPath.join(".");

  return __(i18nkey);
}

var Permission = React.createClass({
  getInitialState: function() {
    return {
      inputValue: this.props.permissionLink.value
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      inputValue: nextProps.permissionLink.value
    });
  },

  updatePermission: function(permission) {
    this.props.permissionLink && this.props.permissionLink.requestChange(permission);
  },

  updateNumberInputPermission: function() {
    var numberValue = parseFloat(this.state.inputValue);

    if (isNaN(numberValue)) {
      numberValue = undefined;
    } else if(numberValue > this.props.refPerm && this.props.refPerm !== 0) {
      // Busted the maximum, at least put it back to the maximum.
      numberValue = this.props.refPerm;
    }

    this.updatePermission(numberValue);
  },

  updateCheckboxPermission: function(e) {
    this.updatePermission(e.target.checked);
  },

  render: function() {
    var self = this;
    var inputLabel = nameForPermission(this.props.permPath);
    var isCheckbox = typeof this.props.refPerm === "boolean";

    if (isCheckbox) {
      return (
        !self.props.readOnly ?
          <form className="form-horizontal">
            <BSInput
              type="checkbox"
              label={inputLabel}
              checked={this.props.permissionLink.value}
              disabled={self.props.disabled}
              onChange={this.updateCheckboxPermission}
            />
          </form> :
          <span>{this.props.permissionLink.value ? inputLabel : null}</span>
      );
    }

    var maximum = this.props.refPerm || undefined;

    var valueLink = {
      value: this.state.inputValue,
      requestChange: function(newValue) {
        self.setState({
          inputValue: newValue
        })
      }
    };

    return (
      <BSRow>
        <BSCol lg={2}>
          {!self.props.readOnly ?
            <BSInput
              type="number"
              bsSize="small"
              label={inputLabel}
              max={maximum}
              valueLink={valueLink}
              help={
                maximum &&
                __("user::permissions_edit_maximum", {maximum: maximum})
              }
              disabled={self.props.disabled}
              onBlur={this.updateNumberInputPermission}
            /> :
            valueLink.value ? inputLabel : null
          }
        </BSCol>
      </BSRow>
    );
  }
});

module.exports = Permission;
