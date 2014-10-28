import express = require("express");

function testEmailUnique(req: express.Request, res: express.Response) {
  this.testEmailUnique(function(err, isUnique: bool) {
    if (err) {
      res.send(500);
      return;
    }

    res.send({
      isUnique: isUnique
    });
  });
};

export = testEmailUnique;
