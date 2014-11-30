var localSession = require("session").local;

function getUserEmail() {
  return localSession.user ? localSession.user.email : null;
}

export = getUserEmail;
