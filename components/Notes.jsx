var React      = require("react");

var MKPermissionMixin = require("mykoop-user/components/PermissionMixin");
var MKNotes = require("mykoop-core/components/Notes");

var __         = require("language").__;
var actions    = require("actions");

var Notes = React.createClass({
  mixins: [MKPermissionMixin],

  propTypes: {
    userId: React.PropTypes.number.isRequired,
  },

  render: function() {
    return (
      <div>
        <MKNotes
          resourceId={this.props.userId}
          retrieveNotesAction={actions.user.notes.list}
          addNoteAction={actions.user.notes.new}
          readOnly={!this.constructor.validateUserPermissions({
            user: {
              notes: {
                edit: true
              }
            }
          })}
        />
      </div>
    );
  }

});

module.exports = Notes;
