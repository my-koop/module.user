import express = require("express");

function tryLogin(db: mkdatabase.Module,res: express.Response,req: express.Request){
  var isValid = false;
  var email = req.param("email",null);
  var passwordHash = req.param("pwdhash",null);
  if(db){
    db.getConnection(function(err,connection){
      var query = connection.query(
        "SELECT (count(id)= 1) as isValid FROM user WHERE email = ? AND pwdhash = ?",
        [email,passwordHash],
        function (err,rows){
          if(err){
            res.status(500).end({error: err.toString()});
            return;
          }
          if(rows[0].isValid == '1'){
            //Email is unique
            isValid = true;
          }
        }
      );
    });
    res.json(isValid);
  }
};
export = tryLogin;