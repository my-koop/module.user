import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function tryLogin(req: express.Request, res: express.Response) {
  var self: mkuser.Module = this;
  var email = req.param("email", null);
  var password = req.param("password", null);
  if(!email || !password) {
    logger.debug("Invalid input for request tryLogin");
    return res.status(400).send("Invalud input for request");
  }
  var loginInfo: UserInterfaces.TryLogin = {
    email: req.param("email", null),
    password: req.param("password", null)
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
