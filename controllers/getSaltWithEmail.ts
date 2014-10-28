import express = require("express");

function getSaltWithEmail(req: express.Request, res: express.Response) {
  this.getSaltWithEmail(function(err, salt: string) {
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
