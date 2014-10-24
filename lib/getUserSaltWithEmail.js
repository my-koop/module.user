function getUserSaltWithEmail(db,res,req,email){
  var salt;
  if(db){
    db.getConnection(function(err,connection){
      var query = connection.query(
        'SELECT ? FROM mykoopmysql.user WHERE email = ?',
        ['salt',email],
        function (err,rows){
          if(err){
            throw err;
          }
          if(rows.length > 0){
            //We have salt, what about pepper?
            salt = rows[0]['salt'];
          } 
        }
      );
    });
    res.json(salt);
  }
};
module.exports = getUserSaltWithEmail;