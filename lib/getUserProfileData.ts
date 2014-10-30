import express = require("express");
import UserProfile = require("../classes/UserProfile");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function getUserProfileData(db: mkdatabase.Module, req: express.Request, res: express.Response){
  var profil;
  var id = req.param("id", null);
  if (id === null) {
    logger.debug("Invalid parameter for request getUserProfileData");
    res.end(400);
    return;
  }
  if (db) {
    db.getConnection(function(err,connection) {
      var query = connection.query(
        "SELECT ?? FROM user WHERE id = ?",
        [UserProfile.COLUMNS,id],
        function (err,rows){
          if (err) {
            res.status(500).end({ error: err.toString() });
            return;
          }
          if(rows.length !== 1){
            logger.debug("Invalid user Id provided to getUserProfileData");
            res.end(500);
            return;
          }
          var userRow = rows[0];
          profil = new UserProfile(userRow);
          res.json(profil);
        }
      );

    });
  }
};
export = getUserProfileData;