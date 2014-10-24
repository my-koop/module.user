import express = require("express");

function updateUserPassword(db: mkdatabase.Module,res: express.Response,req: express.Request){
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
            throw err;
          }
        }
      );
    });
    //Confirm update
  }
};
export = updateUserPassword;