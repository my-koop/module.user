import express = require("express");
function getUserSaltWithID(db: mkdatabase.Module,res: express.Response,req: express.Request){
  var salt;
  var id = req.param("id",null);
  if(db){
    db.getConnection(function(err,connection){
      var query = connection.query(
        'SELECT ?? FROM mykoopmysql.user WHERE id = ?',
        ['salt',id],
        function (err,rows){
          if(err){
            throw err;
          }
          if(rows.length === 1){
            //We have salt
            salt = rows[0].salt;
          }
        }
      );
    });
    res.json(salt);
  }
};
export = getUserSaltWithID;