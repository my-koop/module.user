import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function resetPassword(req: express.Request, res: express.Response) {
  this.resetPassword(req.param("email"), function(err) {
    if (err) {
      return res.error(err);
    }

    res.end();
  });
};

export = resetPassword;
