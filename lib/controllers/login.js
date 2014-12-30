var getLogger = require("mykoop-logger");
var logger = getLogger(module);
function login(req, res) {
    var self = this;
    var loginInfo = {
        email: req.param("email"),
        password: req.param("password")
    };
    self.login(loginInfo, function (err, userProfile) {
        if (err) {
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
