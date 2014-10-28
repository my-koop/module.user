import express = require("express");

function getSaltWithId(req: express.Request, res: express.Response) {
  var self: mkuser.Module = this;
  var id = parseInt(req.params("id", -1));
  if(id === -1) {
    return res.send(400);
  }

  self.getSaltWithId(id, function(err, salt: string) {
    if (err) {
      return res.send(500);
    }

    res.send({
      salt: salt
    });
  });
};

export = getSaltWithId;
