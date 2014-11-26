var Router = require("react-router");
var routeData = require("dynamic-metadata").routes;
var localSession = require("session").local;

var PermissionRedirectMixin = {
  statics: {
    willTransitionTo: function (transition) {
      localSession.attemptedTransition = transition;
    }
  },

  componentWillMount: function() {
    if (!this.state.userMeetsPermissions) {
      Router.transitionTo("denied");
    } else {
      delete localSession.attemptedTransition;
    }
  }
};

module.exports = PermissionRedirectMixin;
