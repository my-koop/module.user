function getProfile(req, res) {
    var id = parseInt(req.params("id", -1));
    if (id === -1) {
        return res.send(400);
    }

    var self = this;
    self.getProfile(id, function (err, profile) {
        if (err) {
            return res.send(500);
        }

        res.send({
            profile: profile
        });
    });
}
;

module.exports = getProfile;
