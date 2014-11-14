import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function attachParamUserId(
  req: express.Request,
  res: express.Response,
  next: Function
) {
  res.locals.userId = req.param("id");
  next();
};

export = attachParamUserId;
