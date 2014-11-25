var React     = require("react");
var PropTypes = React.PropTypes;

var BSCol  = require("react-bootstrap/Col");
var BSRow  = require("react-bootstrap/Row");
var BSInput  = require("react-bootstrap/Input");

var __ = require("language").__;

function nameForPermission(permPath) {
  var i18nkey = "permissions::" + permPath.join(".");

  return __(i18nkey);
}

var Permission = React.createClass({
  propTypes: {
    permissionLink: PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number
      ]),
      requestChange: PropTypes.func
    }),
    permPath: PropTypes.arrayOf(React.PropTypes.string).isRequired,
    refPerms: PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number
    ])),
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool
  },

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
    this.props.permissionLink &&
    this.props.permissionLink.requestChange &&
    this.props.permissionLink.requestChange(permission);
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
              checked={this.props.permissionLink.value || false}
              disabled={self.props.disabled}
              onChange={this.updateCheckboxPermission}
            />
          </form> :
          <p>{(this.props.permissionLink.value || self.props.disabled) ? inputLabel : null}</p>
      );
    }

    var maximum = this.props.refPerm || undefined;

    var valueLink = {
      value: !_.isUndefined(this.state.inputValue) ? this.state.inputValue : "",
      requestChange: function(newValue) {
        self.setState({
          inputValue: newValue
        })
      }
    };

    return (
      <BSRow>
        <BSCol sm={2}>
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
            (valueLink.value || self.props.disabled) ?
              <p>
                {inputLabel}:{" "}
                <strong>
                  {(valueLink.value === 0 || self.props.disabled) ?
                    __("user::permissions_edit_nolimit") :
                    valueLink.value
                  }
                </strong>
              </p> :
              null
          }
        </BSCol>
      </BSRow>
    );
  }
});

module.exports = Permission;
