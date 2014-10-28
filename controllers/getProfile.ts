import express = require("express");
import UserProfile = require("../classes/UserProfile");

function getProfile(req: express.Request, res: express.Response) {
  var id = parseInt(req.params("id", -1));
  if(id === -1) {
    return res.send(400);
  }

  var self: mkuser.Module = this;
  self.getProfile(id, function(err, profile: UserProfile) {
    if (err) {
      return res.send(500);
    }

    res.send({
      profile: profile
    });
  });
};

export = getProfile;
