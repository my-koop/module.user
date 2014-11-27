var React      = require("react");
var BSCol      = require("react-bootstrap/Col");
var BSButton   = require("react-bootstrap/Button");
var BSPanel    = require("react-bootstrap/Panel");
var BSInput    = require("react-bootstrap/Input");
var MKAlertTrigger = require("mykoop-core/components/AlertTrigger");
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
      message: null,
      sliceCount: 5,
      sliceIncrement: 5
    }
  },

  getNotes: function(){
    var self = this;
    actions.user.notes.list({
      data: {
        id: self.props.userId
      }
    }, function(err, res){
        if(err){
          console.error(err);
          MKAlertTrigger.showAlert(err);
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
    actions.user.notes.new({
      data: {
        id: self.props.userId,
        message: self.state.message
      }
    }, function(err, res) {
        if(err){
          console.error(err);
          MKAlertTrigger.showAlert(err);
        } else {
          self.getNotes();
        }
      }
    )
  },

  showMoreNotes: function(){
    this.setState({
      sliceCount: this.state.sliceCount + this.state.sliceIncrement
    })
  },

  render: function(){

    var notePanels = _.chain(this.state.notes)
      .map(function(note, i){
        var header = __("user::userNotesAuthor") + " "
          + note.author + " "
          + __("user::userNotesTimePrefix") + " "
          + formatDate(new Date(note.date), "LLL");
        return (
          <BSPanel key={i} header={header}>
            {note.message}
          </BSPanel>
        );
      })
      .slice(0, this.state.sliceCount)
    return (
        <div>
          <h2>
            {__("user::userNotesWelcome")}
          </h2>
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
          { (this.state.sliceCount < _.size(this.state.notes) )?
          <BSButton
            bsSize="small"
            bsStyle="primary"
            onClick={this.showMoreNotes}
          >
          {__("user::userNotesShowMore")}
          </BSButton>
          : null }
        </div>

    );
  }

});

module.exports = Notes;
