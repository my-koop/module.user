function getSaltWithEmail(req, res) {
    var self = this;
    var email = req.params("email");
    if (!email) {
        return res.send(400);
    }
    self.getSaltWithEmail(email, function (err, salt) {
        if (err) {
            res.send(500);
            return;
        }

        res.send({
            salt: salt
        });
    });
}
;

module.exports = getSaltWithEmail;
