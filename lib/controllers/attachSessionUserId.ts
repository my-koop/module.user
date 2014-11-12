import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function attachSessionUserId(
  req: express.Request,
  res: express.Response,
  next: Function
) {
  res.locals.userId = req.session.user.id;
  next();
};

export = attachSessionUserId;
