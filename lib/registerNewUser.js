var UserProfil = require('../classes/UserProfil');
var getDate = require('./getDate');
function registerNewUser(db,res,req,UserProfil,salt,pwdhash){
  var today = getDate();
  var insertData = {
    email: UserProfil.email,
    firstname: UserProfil.firstname,
    lastname: UserProfil.lastname,
    birthdate: UserProfil.birthdate,
    origin: UserProfil.origin,
    phone: UserProfil.phone,
    salt: salt,
    pwdhash: pwdhash,
    signupDate: today
  };
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
module.exports = registerNewUser;