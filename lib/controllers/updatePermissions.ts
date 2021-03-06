import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function updatePermissions(req: express.Request, res: express.Response) {
  var userId = req.param("id");
  var newPermissions = req.param("permissions");

  this.updatePermissions(userId, newPermissions, function(err, success) {
    if (err) {
      logger.verbose(err.toString());
      return res.error(err);
    }

    res.end();
  });
};

export = updatePermissions;
