var getLogger = require("mykoop-logger");
var logger = getLogger(module);

function tryLogin(req, res) {
    var self = this;
    var paramEmail = req.param("email", null);
    var paramPassword = req.param("password", null);
    if (!paramEmail || !paramPassword) {
        logger.debug("Invalid input for request tryLogin");
        return res.status(400).send("Invalud input for request");
    }
    var loginInfo = {
        email: paramEmail,
        password: paramPassword
    };
    self.tryLogin(loginInfo, function (err, isLogin) {
        if (err) {
            logger.debug(err);
            return res.status(500).send(err.toString());
        }

        res.send({
            success: isLogin
        });
    });
}
;

module.exports = tryLogin;
