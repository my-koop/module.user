var React      = require("react");
var BSCol      = require("react-bootstrap/Col");
var BSButton   = require("react-bootstrap/Button");
var BSPanel    = require("react-bootstrap/Panel");
var BSInput    = require("react-bootstrap/Input");
var __         = require("language").__;
var formatDate = require("language").formatDate;
var actions    = require("actions");

var Notes = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    userId: React.PropTypes.number.isRequired,
  },

  getInitialState: function(){
    return {
      notes: null,
      message: null
    }
  },

  getNotes: function(){
    var self = this;
    actions.user.notes({
      data: {
        id: 2
      }
    }, function(err, res){
        if(err){
          console.log(err);
        } else {
          self.setState({
            notes: res.notes
          })
        }
    });
  },

  componentWillMount: function(){
    this.getNotes();
  },

  onSubmit: function(e){
    e.preventDefault();
    var self = this;
    if(self.state.message === null){
      return;
    }
    actions.user.newNote({
      data: {
        id: 2,
        message: self.state.message
      }
    }, function(err, res) {
          if(err){
            console.log(err);
          } else {
            self.getNotes();
          }
      }
    )
  },

  render: function(){

    var notePanels = _.map(this.state.notes, function(note, i){
      var header = __("user::userNotesAuthor") + " " + note.author + " " + __("user::userNotesTimePrefix") + " " + formatDate(new Date(note.date));
      return (
        <BSPanel key={i} header={header}>
          {note.message}
        </BSPanel>
      );
    })
    return (
        <div>
          <h1>
            {__("user::userNotesWelcome") + " 2"}
          </h1>
          <form onSubmit={this.onSubmit}>
            <BSInput
              type="textarea"
              label={__("user::userNotesInputLabel")}
              valueLink={this.linkState("message")}
            />
            <BSInput
              type="submit"
              value={__("user::userNotesSubmit")}
              bsStyle="success"
            />
          </form>

          {notePanels}
        </div>

    );
  }

});

module.exports = Notes;
