import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function updateProfile(req: express.Request, res: express.Response) {
  var id = res.locals.userId;
  var newProfile: mkuser.UserProfile = {
    email          : req.param("email"),
    firstname      : req.param("firstname"),
    lastname       : req.param("lastname"),
    birthdate      : req.param("birthdate"),
    phone          : req.param("phone"),
    origin         : req.param("origin"),
    referral       : req.param("referral"),
    referralSpecify: req.param("referralSpecify"),
    usageFrequency : req.param("usageFrequency"),
    usageNote      : req.param("usageNote")
  };

  this.updateProfile(id,newProfile, function(err, success) {
    if (err) {
      return res.error(err);
    }

    res.send({
      updateSuccess: success
    });
  });
};

export = updateProfile;
