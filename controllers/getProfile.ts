import express = require("express");
import UserProfile = require("../classes/UserProfile");
function getProfile(req: express.Request, res: express.Response) {
  this.getProfile(function(err, profile: UserProfile) {
    if (err) {
      res.send(500);
      return;
    }

    res.send({
      profile: profile
    });
  });
};

export = getProfile;
