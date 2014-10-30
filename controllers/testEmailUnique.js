var getLogger = require("mykoop-logger");
var logger = getLogger(module);

function testEmailUnique(req, res) {
    var email = req.params.email;
    if (!email) {
        logger.debug("Invalid input for request testEmailUnique");
        return res.send(500);
    }

    var self = this;
    self.testEmailUnique(email, function (err, isUnique) {
        if (err) {
            logger.debug(err);
            return res.send(500);
        }

        res.send({
            isUnique: isUnique
        });
    });
}
;

module.exports = testEmailUnique;
