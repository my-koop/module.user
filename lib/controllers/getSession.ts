import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function getSession(req: express.Request, res: express.Response) {
  var session = req.session.user;

  if (!session) {
    return res.send({});
  }

  res.send({
    id: session.id,
    email: session.email,
    perms: session.perms
  });
}

export = getSession;
