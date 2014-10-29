import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function getSaltWithEmail(req: express.Request, res: express.Response) {
  var self: mkuser.Module = this;
  var email = req.params("email");
  if(!email) {
    logger.debug("Invalid input for request getSaltWithEmail");
    return res.send(400);
  }

  self.getSaltWithEmail(email, function(err, salt: string) {
    if (err) {
      logger.debug(err);
      return res.send(500);
    }

    res.send({
      salt: salt
    });
  });
};

export = getSaltWithEmail;
