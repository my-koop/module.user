//Not used for now

import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function testEmailUnique(req: express.Request, res: express.Response) {
  var email = req.params.email;
  if(!email) {
    logger.debug("Invalid input for request testEmailUnique");
    return res.send(500);
  }

  var self: mkuser.Module = this;
  self.testEmailUnique(email, function(err, isUnique: boolean) {
    if (err) {
      logger.debug(err);
      return res.send(500);
    }

    res.send({
      isUnique: isUnique
    });
  });
};

export = testEmailUnique;
