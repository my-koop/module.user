var Router = require("react-router");
var actions = require("actions");
var localSession = require("session").local;
var website = require("website");

function logoutUser() {
  Router.transitionTo("home");
  delete localSession.user;

  if (!actions.user) {
    return;
  }

  // This is a fire and forget call to try to keep the backend in sync. No
  // error management is going to help us in production.
  actions.user.current.logout(function (err) {
    if (err) {
      console.error(err);
    }

    website.render();
  });
}

export = logoutUser;
