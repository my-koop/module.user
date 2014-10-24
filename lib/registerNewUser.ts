import express = require("express");
import UserProfile = require('../classes/UserProfile');
import getDate = require('./getDate');

//Req will use UserProfile,salt,pwdhash
function registerNewUser(db: mkdatabase.Module,res: express.Response,req: express.Request){
  var today = getDate();
   var insertData = {};
  //   email: UserProfil.email,
  //   firstname: UserProfil.firstname,
  //   lastname: UserProfil.lastname,
  //   birthdate: UserProfil.birthdate,
  //   origin: UserProfil.origin,
  //   phone: UserProfil.phone,
  //   salt: salt,
  //   pwdhash: pwdhash,
  //   signupDate: today
  // };
  if(db){
    db.getConnection(function(err,connection){
      var query = connection.query(
        'INSERT INTO user SET ? ',
        [insertData],
        function (err,rows){
          if(err){
            throw err;
          }
        }
      );
    });
    //Confirm success
  }
};
export = registerNewUser;