import express = require("express");
function getUserSaltWithEmail(db: mkdatabase.Module,res: express.Response,req: express.Request){
  var salt;
  var email = req.param("email",null);
  if(db){
    db.getConnection(function(err,connection){
      var query = connection.query(
        'SELECT ?? FROM user WHERE email = ?',
        ['salt',email],
        function (err,rows){
          if(err){
            throw err;
          }
          if(rows.length == 1){
            //We have salt, what about pepper?
            salt = rows[0].salt;
          }
        }
      );
    });
    res.json(salt);
  }
};
export = getUserSaltWithEmail;