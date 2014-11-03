import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function registerUser(req: express.Request, res: express.Response) {
  var self: mkuser.Module = this;

  //FIX ME consider case referral == other and referralSpecify isnt empty
  var profile: UserInterfaces.RegisterNewUser = {
    email:          req.param("email"),
    firstname:      req.param("firstname"),
    lastname:       req.param("lastname"),
    phone:          req.param("phone",null),
    origin:         req.param("origin", null),
    birthday:       req.param("birthdate",null),
    usageNote:      req.param("usageNote"),
    usageFrequency: req.param("usage",null),
    referral:       req.param("referral",null),
    passwordToHash: req.param("passwordToHash"),
    confPassword:   req.param("confPassword")
  };


  self.registerNewUser(profile, function(err, registered: boolean) {
    if (err) {
      logger.verbose(err);
      return res.status(500).send({
        error: err.toString()
        }
      );
    }

    res.send({
      registered: true
    });
  });
};

export = registerUser;
