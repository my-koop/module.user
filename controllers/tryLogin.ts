import express = require("express");

function tryLogin(req: express.Request, res: express.Response) {
  var self: mkuser.Module = this;
  var email = req.param("email", null);
  var passwordHash = req.param("pwdhash", null);
  if(!email || !passwordHash) {
    return res.send(400);
  }

  self.tryLogin(email, passwordHash, function(err, isLogin: boolean) {
    if (err) {
      res.send(500);
      return;
    }

    res.send({
      isLogin: isLogin
    });
  });
};

export = tryLogin;
