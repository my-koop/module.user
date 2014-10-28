function testEmailUnique(req, res) {
    var email = req.params.email;
    if (!email) {
        return res.send(500);
    }

    var self = this;
    self.testEmailUnique(email, function (err, isUnique) {
        if (err) {
            return res.send(500);
        }

        res.send({
            isUnique: isUnique
        });
    });
}
;

module.exports = testEmailUnique;
