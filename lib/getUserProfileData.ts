import express = require("express");

import UserProfile = require("../classes/UserProfile");
function getUserProfileData(db: mkdatabase.Module, req: express.Request, res: express.Response){
  var profil;
  var id = req.param("id", null);
  if (!id) {
    res.end(400);
    return;
  }
//testing
  if (db) {
    db.getConnection(function(err,connection) {
      var query = connection.query(
        "SELECT ?? FROM user WHERE id = ?",
        [UserProfile.COLUMNS,id],
        function (err,rows){
          if (err || rows.length !== 1) {
            res.status(500).end({ error: err.toString() });
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