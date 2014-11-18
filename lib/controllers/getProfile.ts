import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function getUserProfileCommon(params) {
  var req = params.req;
  var res = params.res;
  var isFullProfile = params.fullProfile

  var id = parseInt(req.param("id", -1));
  if(id === -1) {
    return res.send(400);
  }

  var self: mkuser.Module = this;
  self.getProfile(id, function(err, profile) {
    if (err) {
      return res.status(500).send("Unable to get profile");
    }

    //FIXME: We might want to have a constructive "whitelist" approach to the
    // public profile rather than a "blacklist" destructive approach to the
    // full profile.
    if (!isFullProfile) {
      delete profile.permissions;
    }

    res.send({
      userProfile: profile
    });
  });
};

export function getFullProfile(req: express.Request, res: express.Response) {
  getUserProfileCommon({req: req, res: res, fullProfile: true});
};

export function getPublicProfile(req: express.Request, res: express.Response) {
  getUserProfileCommon({req: req, res: res);
};
