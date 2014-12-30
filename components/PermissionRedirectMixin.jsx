var Router = require("react-router");
var localSession = require("session").local;

var PermissionRedirectMixin = {
  statics: {
    willTransitionTo: function (transition) {
      localSession.attemptedTransition = transition;
    }
  },

  componentWillMount: function() {
    if (!this.state.userMeetsPermissions) {
      Router.replaceWith("denied");
    } else {
      delete localSession.attemptedTransition;
    }
  }
};

module.exports = PermissionRedirectMixin;
