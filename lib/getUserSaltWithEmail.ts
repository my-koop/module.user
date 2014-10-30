import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function getUserSaltWithEmail(db: mkdatabase.Module,req: express.Request,res: express.Response){
  var salt;
  var email = req.param("email",null);
  if(db){
    db.getConnection(function(err,connection){
      var query = connection.query(
        'SELECT salt FROM user WHERE email = ?',
        [email],
        function (err,rows){
          if(err){
            res.status(500).end( {
                error : err.toString()
              });
          }
          if(rows.length === 1){
            //We have salt, what about pepper?
            salt = rows[0].salt;
          }
          res.json(salt);
        }
      );
    });

  }
};
export = getUserSaltWithEmail;