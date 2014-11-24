var getLogger = require("mykoop-logger");
var logger = getLogger(module);
var AuthenticationError = require("../classes/AuthenticationError");
function login(req, res) {
    var self = this;
    var paramEmail = req.param("email", null);
    var paramPassword = req.param("password", null);
    if (!paramEmail || !paramPassword) {
        logger.debug("Invalid input for request tryLogin");
        return res.status(400).send("Invalid input for request");
    }
    var loginInfo = {
        email: paramEmail,
        password: paramPassword
    };
    self.login(loginInfo, function (err, userProfile) {
        if (err) {
            if (err instanceof AuthenticationError) {
                logger.verbose(err);
                return res.error(err, 403);
            }
            logger.error(err);
            return res.error(err);
        }
        var session = req.session;
        var userSessionData = {
            id: userProfile.id,
            email: userProfile.email,
            perms: userProfile.perms
        };
        session.user = userSessionData;
        res.send(userSessionData);
    });
}
;
module.exports = login;
