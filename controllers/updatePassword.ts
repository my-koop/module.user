import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function updatePassword(req: express.Request, res: express.Response) {
  var id = parseInt(req.param("id", -1));
  if(id === -1) {
    return res.send(400);
  }
  var passwords: UserInterfaces.updatePassword = {
      newPassword:     req.param("newPassword"),
      confNewPassword: req.param("confNewPassword"),
      oldPassword:     req.param("oldPassword")
  };
  var self: mkuser.Module = this;
  self.updatePassword(id,passwords, function(err) {
    if (err) {
      return res.error(err);
    }

    res.end();
  });
};

export = updatePassword;
