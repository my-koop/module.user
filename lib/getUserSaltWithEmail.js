function getUserSaltWithEmail(db, req, res) {
    var salt;
    var email = req.param("email", null);
    if (db) {
        db.getConnection(function (err, connection) {
            var query = connection.query('SELECT salt FROM user WHERE email = ?', [email], function (err, rows) {
                if (err) {
                    throw err;
                }
                if (rows.length == 1) {
                    //We have salt, what about pepper?
                    salt = rows[0].salt;
                }
                res.json(salt);
            });
        });
    }
}
;
module.exports = getUserSaltWithEmail;
