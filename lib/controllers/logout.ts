import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function logout(req: express.Request, res: express.Response) {
  delete req.session.user;
  res.sendStatus(200);
}

export = logout;
