var React  = require("react");
var Router = require("react-router");

var BSPanel     = require("react-bootstrap/Panel");
var BSInput     = require("react-bootstrap/Input");
var BSButton    = require("react-bootstrap/Button");
var BSAccordion = require("react-bootstrap/Accordion");

var MKAlert               = require("mykoop-core/components/Alert");
var MKConfirmationTrigger = require("mykoop-core/components/ConfirmationTrigger");

var actions = require("actions");
var _ = require("lodash");
var __ = require("language").__;

var userContributions = require("dynamic-metadata").userContributions;
var registerContributions = _.toArray(
  userContributions && userContributions.registerForm
).filter(function(contribution) {
  return contribution.titleKey && _.isFunction(contribution.component);
}).map(function(contribution) {
  contribution.component = contribution.component();
  return contribution;
});

var MKRegisterAccountInfo = require("./RegisterAccountInfo");
var MKRegisterOptionalInfo = require("./RegisterOptionalInfo");
registerContributions = [
  {
    titleKey: "user::register_header_acc_info",
    component: MKRegisterAccountInfo
  },
  {
    titleKey: "user::register_header_opt_info",
    component: MKRegisterOptionalInfo
  }
].concat(registerContributions);

var totalPanels = registerContributions.length;

var RegisterPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      key: 0,
      success: 0
    };
  },

  // Indicate we sent a request and are waiting for a response
  pendingRequest: false,

  // Checks if we can send a new request to the server
  canSendRequest: function() {
    return !this.pendingRequest && !this.hasSentSuccessfully();
  },

  // Checks if we received a positive response from the server
  hasSentSuccessfully: function() {
    return this.state.success === 1;
  },

  // Get message to display in the form (null = no message)
  getMessage: function() {
    switch(this.state.success) {
    case 1: return __("user::register_success_message");
    case 2: return __("user::register_failure_message");
    default: return null;
    }
  },

  // Get style to use for message
  getMessageStyle: function() {
    switch(this.state.success) {
    case 1: return "success";
    case 2: return "danger";
    default: return null;
    }
  },

  // Captures shift+tab & tab key to go up or down in the accordion
  checkGoingUpDownKey: function(e) {
    if(e.shiftKey && e.keyCode === 9) {
      this.previousPanel();
      e.preventDefault();
    } else if(e.keyCode === 9) {
      this.nextPanel();
      e.preventDefault();
    }
  },

  // Captures shift+tab to go up in the accordion
  checkGoingUpKey: function(e) {
    if(e.shiftKey && e.keyCode === 9) {
      this.previousPanel();
      e.preventDefault();
    }
  },

  // Captures tab key to go down in the accordion
  checkGoingDownKey: function(e) {
    if(!e.shiftKey && e.keyCode === 9) {
      this.nextPanel();
      e.preventDefault();
    }
  },

  // Go to previous panel
  previousPanel: function() {
    var key = this.state.key ? this.state.key - 1 : totalPanels - 1;
    this.selectPanel(key);
  },

  // Go to next panel
  nextPanel: function() {
    this.selectPanel((this.state.key + 1) % totalPanels);
  },

  // Select an arbitrary panel
  selectPanel: function(key) {
    var self = this;
    this.setState({
      key: key
    }, function() {
      var onEnterFocus = self.refs[self.contributionRefs[key]].onEnterFocus;
      onEnterFocus && onEnterFocus();
    });
  },

  // Handler when clicking on a panel header in the accordion
  handleSelect: function(selectedKey) {
    this.selectPanel(selectedKey);
  },

  submitForm: function() {
    var self = this;
    // This assumes that the first 2 panels are ours
    var data = _.merge(
      this.refs.contribution0.getAccountInfo(),
      this.refs.contribution1.getOptionalInfo()
    );
    if( self.canSendRequest() && (self.pendingRequest = true) ) {
      actions.user.register({
        i18nErrors: {},
        data: data
      },
      function (err, res) {
        var registerSuccess;
        if (err) {
          console.error(err);
          registerSuccess = 0;
        } else {
          console.log(res);
          registerSuccess = 1;
        }

        self.setState({
          success: registerSuccess
        },
        function() {
          self.pendingRequest = false;
          if(self.hasSentSuccessfully()) {
            // Redirect to homepage after 2 seconds
            setTimeout(function() {
              Router.transitionTo("home");
            }, 2000);
          }
        });
      });
    }
  },

  contributionRefs: [],
  render: function() {
    var self = this;
    this.contributionRefs = [];
    var extraPanels = _.map(registerContributions, function(contribution, i) {
      var Component = contribution.component;
      var checkGoingUpDownKey = self.checkGoingUpDownKey;
      var checkGoingUpKey = self.checkGoingUpKey;
      var checkGoingDownKey = self.checkGoingDownKey;
      // Last panel have no where to go after so we block it there
      var isLast = i === registerContributions.length - 1
      /*if(isLast) {
        checkGoingDownKey = _.noop;
        checkGoingUpDownKey = checkGoingUpKey;
      }*/
      var ref = "contribution" + i;
      self.contributionRefs.push(ref);
      return (
        <BSPanel header={__(contribution.titleKey)} key={i}>
          <Component
            ref={ref}
            checkGoingUpDownKey={checkGoingUpDownKey}
            checkGoingUpKey={checkGoingUpKey}
            checkGoingDownKey={checkGoingDownKey}
          />
          { !isLast ?
            <BSButton
              onClick={self.nextPanel}
              className="pull-right"
            >
              {__("user::register_panel_next")}
            </BSButton>
          : null}
        </BSPanel>
      );
    });

    return (
      <BSPanel header={__("user::register_panel_header")} >
        <MKAlert bsStyle={this.getMessageStyle()}>
          {this.getMessage()}
        </MKAlert>
        <BSAccordion activeKey={this.state.key} onSelect={this.handleSelect}>
          {extraPanels}
        </BSAccordion>

        <MKConfirmationTrigger
          message={__("user::register_trigger_message")}
          onYes={this.submitForm}
        >
          <BSButton
            bsStyle="primary"
            bsSize="large"
            className="pull-right"
          >
            {__("user::register_submit_button")}
          </BSButton>
        </MKConfirmationTrigger>
      </BSPanel>
    );
  }
});

module.exports = RegisterPage;
