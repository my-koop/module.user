var getLogger = require("mykoop-logger");
var logger = getLogger(module);

function tryLogin(req, res) {
    var self = this;
    var email = req.param("email", null);
    var passwordHash = req.param("pwdhash", null);
    if (!email || !passwordHash) {
        logger.debug("Invalid input for request tryLogin");
        return res.send(400);
    }

    self.tryLogin(email, passwordHash, function (err, isLogin) {
        if (err) {
            logger.debug(err);
            return res.send(500);
        }

        res.send({
            isLogin: isLogin
        });
    });
}
;

module.exports = tryLogin;
