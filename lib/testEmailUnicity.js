function testEmailUnicity(db, req, res) {
    var isUnique = false;
    var email = req.param("email", null);
    if (db) {
        db.getConnection(function (err, connection) {
            var query = connection.query("SELECT (count(id)= 0) as isUnique FROM user WHERE email = ?", [email], function (err, rows) {
                if (err) {
                    res.end({ error: err.toString() });
                    return;
                }
                if (rows[0].isUnique == '1') {
                    //Email is unique
                    isUnique = true;
                    res.json(isUnique);
                }
            });
        });
    }
}
;
module.exports = testEmailUnicity;