import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);
import AuthenticationError = require("../classes/AuthenticationError");

function login(req: express.Request, res: express.Response) {
  var self: mkuser.Module = this;

  var loginInfo: UserInterfaces.LoginRequestData = {
    email:  req.param("email"),
    password:  req.param("password")
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
