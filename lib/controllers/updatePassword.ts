import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function updatePassword(req: express.Request, res: express.Response) {
  var id = res.locals.userId;
  var passwords: UserInterfaces.updatePassword = {
      newPassword:     req.param("newPassword"),
      confNewPassword: req.param("confNewPassword"),
      oldPassword:     req.param("oldPassword")
  };

  this.updatePassword(id, passwords, function(err) {
    if (err) {
      return res.error(err);
    }

    res.end();
  });
};

export = updatePassword;
