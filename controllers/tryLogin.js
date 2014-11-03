var getLogger = require("mykoop-logger");
var logger = getLogger(module);

function tryLogin(req, res) {
    var self = this;
    var email = req.param("email", null);
    var password = req.param("password", null);
    if (!email || !password) {
        logger.debug("Invalid input for request tryLogin");
        return res.status(400).send("Invalud input for request");
    }
    var loginInfo = {
        email: req.param("email", null),
        password: req.param("password", null)
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
