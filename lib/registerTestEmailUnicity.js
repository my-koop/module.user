function registerTestEmailUnicity(db,res,req,email){
  var isUnique = false;
  if(db){
    db.getConnection(function(err,connection){
      var query = connection.query(
        'SELECT (count(id)= 0) as isUnique
         FROM mykoopmysql.user  
         WHERE email = ?',
        [email],
        function (err,rows){
          if(err){
            throw err;
          }
          if(rows[0]['isUnique'] == '1'){
            //Email is unique
            isUnique = true;
          } 
        }
      );
    });
    res.json(isUnique);
  }
};
module.exports = registerTestEmailUnicity;