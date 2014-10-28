function getSaltWithId(req, res) {
    var self = this;
    var id = parseInt(req.params("id", -1));
    if (id === -1) {
        return res.send(400);
    }

    self.getSaltWithId(id, function (err, salt) {
        if (err) {
            return res.send(500);
        }

        res.send({
            salt: salt
        });
    });
}
;

module.exports = getSaltWithId;
