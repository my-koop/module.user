var React             = require("react");
var BSCol             = require("react-bootstrap/Col");
var BSButton          = require("react-bootstrap/Button");
var BSModalTrigger    = require("react-bootstrap/ModalTrigger");
var MKIcon            = require("mykoop-core/components/Icon");
var MKTableSorter     = require("mykoop-core/components/TableSorter");
var MKListModButtons  = require("mykoop-core/components/ListModButtons");
var MKAlertTrigger    = require("mykoop-core/components/AlertTrigger");
var __                = require("language").__;
var formatDate        = require("language").formatDate;
var actions           = require("actions");
var Router            = require("react-router");

var Items = React.createClass({
  getInitialState: function() {
    return {
      users: []
    }
  },

  componentWillMount: function() {
    var self = this;
    actions.user.list(function(err, ret){
      if(err){
        MKAlertTrigger.showAlert(__("errors::error"));
      } else {
        self.setState({
          users: ret.users
        })
      }
    });
  },

  actionsGenerator: function(user) {
    return [
      {
        icon: "edit",
        tooltip: {
          text: __("user::userListEditButton"),
          overlayProps: {
            placement: "top"
          }
        },
        callback: function() {
          Router.transitionTo("adminEdit", {id: user.id});
        }
      },
      // FIXME:: Check for bill creation permission
      {
        icon: "credit-card",
        tooltip: {
          text: __("user::createBillForUser"),
          overlayProps: {
            placement: "top"
          }
        },
        callback: function() {
          Router.transitionTo("newBill", {}, {email: user.email});
        }
      }
    ];
  },

  render: function() {
    var self = this;
    var CONFIG = {
      defaultOrdering: [
        "id",
        "email",
        "firstname",
        "lastname",
        "isMember",
        "activeUntil",
        "actions"
      ],
      columns: {
        id: {
          name: __("user::userListHeaderId"),
        },
        email: {
          name: __("user::userListHeaderEmail"),
        },
        firstname: {
          name: __("user::userListHeaderFirstname"),
        },
        lastname: {
          name: __("user::userListHeaderLastname"),
        },
        isMember: {
          name: __("user::userListHeaderisActive"),
        },
        activeUntil: {
          name: __("user::userListHeaderActiveUntil"),
          cellGenerator: function(user) {
            return (
              (user.activeUntil !== null) ? formatDate(new Date(user.activeUntil)) : null
            );
          }
        },
        actions: {
          name: __("actions"),
          headerProps: {className: "list-mod-min-width-2"},
          isStatic: true,
          cellGenerator: function(user) {
            return (
              <MKListModButtons
                defaultTooltipDelay={500}
                buttons={self.actionsGenerator(user)}
              />
            );
          }
        }
      }
    };

    return (
      <BSCol md={12}>
        <div>
          <h1>
            {__("user::userListWelcome")}
          </h1>
          <MKTableSorter
            config={CONFIG}
            items={this.state.users}
            striped
            bordered
            condensed
            hover
          />
        </div>
      </BSCol>
    );
  }
});

module.exports = Items;
