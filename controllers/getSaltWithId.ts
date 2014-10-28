import express = require("express");

function getEmailWithId(req: express.Request, res: express.Response) {
  this.getEmailWithId(function(err, salt: string) {
    if (err) {
      res.send(500);
      return;
    }

    res.send({
      salt: salt
    });
  });
};

export = getEmailWithId;
