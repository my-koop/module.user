var getLogger = require("mykoop-logger");
var logger = getLogger(module);

function getProfile(req, res) {
    var id = parseInt(req.param("id", -1));
    if (id === -1) {
        return res.send(400);
    }

    var self = this;
    self.getProfile(id, function (err, profile) {
        if (err) {
            return res.status(500).send("Unable to get profile");
        }

        res.send({
            userProfile: profile
        });
    });
}
;

module.exports = getProfile;
