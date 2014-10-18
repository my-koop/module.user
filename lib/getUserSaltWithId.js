function getUserSaltWithID(db,res,req,id){
  var salt;
  if(db){
    db.getConnection(function(err,connection){
      var query = connection.query(
        'SELECT ? FROM mykoopmysql.user WHERE id = ?',
        ['salt',id],
        function (err,rows){
          if(err){
            throw err;
          }
          if(rows.length > 0){
            //We have salt
            salt = rows[0]['salt'];
          } 
        }
      );
    });
    res.json(salt);
  }
};
module.exports = getUserSaltWithID;