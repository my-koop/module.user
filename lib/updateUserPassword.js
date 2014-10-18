function updateUserPassword(db,res,req,id,pwdhash){
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
module.exports = updateUserPassword;