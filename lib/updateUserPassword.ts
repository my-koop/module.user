import express = require("express");

function updateUserPassword(db: mkdatabase.Module,req: express.Request,res: express.Response){
  var id = req.param("id",null);
  var pwdhash = req.param("pwdhash",null);

  if(db){
    db.getConnection(function(err,connection){
      var updateData = {
        pwdhash: pwdhash
      }
      var query = connection.query(
        'UPDATE user SET ? WHERE id = ?',
        [updateData,id],
        function (err,rows){
          if(err){
           res.status(500).end( {
                error : err.toString()
              });
          }
        }
      );
    });
    //FIX ME: Confirm update
  }
};
export = updateUserPassword;