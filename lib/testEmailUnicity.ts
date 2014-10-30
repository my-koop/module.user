import express = require("express");

function testEmailUnicity(db: mkdatabase.Module,req: express.Request,res: express.Response){
  var isUnique = false;
  var email = req.param("email",null);
  if(db){
    db.getConnection(function(err,connection){
      var query = connection.query(
        "SELECT (count(id)= 0) as isUnique FROM user WHERE email = ?",
        [email],
        function (err,rows){
          if(err){
            res.status(500).end({
              error: err.toString()
            });
            return;
          }
          if(rows[0].isUnique === '1'){
            //Email is unique
            res.json({
                unique: true
              });
          } else {
            res.json({
                unique: false
              });
          }
        }
      );
    });

  }
};
export = testEmailUnicity;