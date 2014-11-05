import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function tryLogin(req: express.Request, res: express.Response) {
  var self: mkuser.Module = this;
  var paramEmail = req.param("email", null);
  var paramPassword = req.param("password", null);
  if(!paramEmail || !paramPassword) {
    logger.debug("Invalid input for request tryLogin");
    return res.status(400).send("Invalud input for request");
  }
  var loginInfo: UserInterfaces.TryLogin = {
    email: paramEmail,
    password: paramPassword
  }
  self.tryLogin(loginInfo, function(err, isLogin: boolean) {
    if (err) {
      logger.debug(err);
      return res.status(500).send(err.toString());
    }

    res.send({
      success: isLogin
    });
  });
};

export = tryLogin;
