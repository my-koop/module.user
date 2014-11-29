import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function registerUser(req: express.Request, res: express.Response) {
  var self: mkuser.Module = this;

  //FIX ME consider case referral == other and referralSpecify isnt empty
  var profile: mkuser.RegisterNewUser.Params = {
    email:          req.param("email"),
    firstname:      req.param("firstName"),
    lastname:       req.param("lastName"),
    phone:          req.param("phone",null),
    origin:         req.param("origin", null),
    birthday:       req.param("birthdate",null),
    usageNote:      req.param("usageNote"),
    usageFrequency: req.param("usage",null),
    referral:       req.param("referral",null),
    // FIXME: Handle referral specify
    passwordToHash: req.param("password"),
    confPassword:   req.param("confpassword")
  };


  self.registerNewUser(profile, function(err, result) {
    if (err) {
      return res.error(err);
    }
    res.send(result);
  });
};

export = registerUser;
