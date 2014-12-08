var React      = require("react");

var MKNotes = require("mykoop-core/components/Notes");

var __         = require("language").__;
var actions    = require("actions");

var Notes = React.createClass({

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
        />
      </div>
    );
  }

});

module.exports = Notes;
