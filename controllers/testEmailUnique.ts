import express = require("express");

function testEmailUnique(req: express.Request, res: express.Response) {
  var email = req.params.email;
  if(!email) {
    return res.send(500);
  }

  var self: mkuser.Module = this;
  self.testEmailUnique(email, function(err, isUnique: boolean) {
    if (err) {
      return res.send(500);
    }

    res.send({
      isUnique: isUnique
    });
  });
};

export = testEmailUnique;
