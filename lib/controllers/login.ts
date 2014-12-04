import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);
import AuthenticationError = require("../classes/AuthenticationError");

function login(req: express.Request, res: express.Response) {
  var self: mkuser.Module = this;
  var paramEmail = req.param("email", null);
  var paramPassword = req.param("password", null);
  if(!paramEmail || !paramPassword) {
    logger.debug("Invalid input for request tryLogin");
    return res.status(400).send("Invalid input for request");
  }
  var loginInfo: UserInterfaces.LoginRequestData = {
    email: paramEmail,
    password: paramPassword
  }
  self.login(loginInfo, function(err, userProfile) {
    if (err) {
      return res.error(err);
    }

    var session = req.session;

    var userSessionData = {
      id: userProfile.id,
      email: userProfile.email,
      perms: userProfile.perms
    };

    session.user = userSessionData;

    res.send(userSessionData);
  });
};

export = login;
