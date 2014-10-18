var UserProfil = require("../classes/UserProfil");
function updateUserProfilData(db,res,req,UserProfil,id){
  if(db){
    db.getConnection(function(err,connection){
      var updateData = {
        email: UserProfil.email,
        firstname: UserProfil.firstname,
        lastname: UserProfil.lastname,
        birthdate: UserProfil.birthdate,
        phone: UserProfil.phone,
        origin: UserProfil.origin
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
  }
};
module.exports = updateUserProfilData;