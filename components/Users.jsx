var React             = require("react");
var BSCol             = require("react-bootstrap/Col");
var BSButton          = require("react-bootstrap/Button");
var BSModalTrigger    = require("react-bootstrap/ModalTrigger");
var MKIcon            = require("mykoop-core/components/Icon");
var MKTableSorter     = require("mykoop-core/components/TableSorter");
var MKListModButtons  = require("mykoop-core/components/ListModButtons");
var __                = require("language").__;
var actions           = require("actions");

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

  actionsGenerator: function() {
    return [];
  },

  render: function() {
    var self = this;
    var CONFIG = {
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
        },

        actions: {
          name: __("actions"),
          isStatic: true,
          cellGenerator: function(item) {
            return (
              <MKListModButtons
                defaultTooltipDelay={500}
                buttons={self.actionsGenerator(item)}
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
