var getLogger = require("mykoop-logger");
var logger = getLogger(module);

function getSaltWithEmail(req, res) {
    var self = this;
    var email = req.params("email");
    if (!email) {
        logger.debug("Invalid input for request getSaltWithEmail");
        return res.send(400);
    }

    self.getSaltWithEmail(email, function (err, salt) {
        if (err) {
            logger.debug(err);
            return res.send(500);
        }

        res.send({
            salt: salt
        });
    });
}
;

module.exports = getSaltWithEmail;
