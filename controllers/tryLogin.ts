import express = require("express");

function tryLogin(req: express.Request, res: express.Response) {
  this.tryLogin(function(err, isLogin: bool) {
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
