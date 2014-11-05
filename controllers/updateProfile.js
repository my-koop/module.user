var getLogger = require("mykoop-logger");
var logger = getLogger(module);

function updateProfile(req, res) {
    var id = parseInt(req.param("id", -1));
    if (id === -1) {
        return res.send(400);
    }
    var newProfile = {
        email: req.param("email"),
        firstname: req.param("firstname"),
        lastname: req.param("lastname"),
        birthdate: new Date(req.param("birthdate")),
        phone: req.param("phone"),
        origin: req.param("origin"),
        referral: req.param("referral"),
        usageFrequency: req.param("usageFrequency"),
        usageNote: req.param("usageNote")
    };

    this.updateProfile(id, newProfile, function (err, success) {
        if (err) {
            logger.verbose(err.toString());
            return res.status(500).send(err.toString());
        }

        res.send({
            updateSuccess: success
        });
    });
}
;

module.exports = updateProfile;
