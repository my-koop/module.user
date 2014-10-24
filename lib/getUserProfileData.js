var UserProfile = require("../classes/UserProfile");
function getUserProfileData(db, req, res) {
    var profil;
    var id = req.param("id", null);
    if (!id) {
        res.end(400);
        return;
    }

    //testing
    if (db) {
        db.getConnection(function (err, connection) {
            var query = connection.query("SELECT ?? FROM user WHERE id = ?", [UserProfile.COLUMNS, id], function (err, rows) {
                if (err || rows.length !== 1) {
                    res.status(500).end({ error: err.toString() });
                    return;
                }
                var userRow = rows[0];
                profil = new UserProfile(userRow);
                res.json(profil);
            });
        });
    }
}
;
module.exports = getUserProfileData;
