var UserProfil = require("../classes/UserProfil");
function getUserProfilData(db,res,req,id){
	var profil;
	if(db){
		db.getConnection(function(err,connection){
			var query = connection.query(
				'SELECT ?? FROM ?? WHERE id = ??',
				[['email','firstname','lastname','birthdate','phone','origin'],'user',id],
				function (err,rows){
					if(err || rows.length > 1){
						throw err;
					}
					var userRow = rows[0];
					profil = new UserProfil(
						userRow['email'],
						userRow['firstname'],
						userRow['lastname'],
						userRow['birthdate'],
						userRow['phone'],
						userRow['origin']
					);
					res.json(profil);
				}
			);

		});
	}
};
module.exports = getUserProfilData;