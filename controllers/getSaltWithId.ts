import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function getSaltWithId(req: express.Request, res: express.Response) {
  var self: mkuser.Module = this;
  var id = parseInt(req.param("id", -1));
  if(id === -1) {
    logger.debug("Invalid input for request getSaltWithId");
    return res.send(400);
  }

  self.getSaltWithId(id, function(err, salt: string) {
    if (err) {
      logger.debug(err);
      return res.send(500);
    }

    res.send({
      salt: salt
    });
  });
};

export = getSaltWithId;
