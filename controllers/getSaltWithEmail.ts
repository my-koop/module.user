import express = require("express");

function getSaltWithEmail(req: express.Request, res: express.Response) {
  var self: mkuser.Module = this;
  var email = req.params("email");
  if(!email) {
    return res.send(400);
  }
  self.getSaltWithEmail(email, function(err, salt: string) {
    if (err) {
      res.send(500);
      return;
    }

    res.send({
      salt: salt
    });
  });
};

export = getSaltWithEmail;
