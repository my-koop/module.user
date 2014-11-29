var getLogger = require("mykoop-logger");
var logger = getLogger(module);
function registerUser(req, res) {
    var self = this;
    //FIX ME consider case referral == other and referralSpecify isnt empty
    var profile = {
        email: req.param("email"),
        firstname: req.param("firstname"),
        lastname: req.param("lastname"),
        phone: req.param("phone", null),
        origin: req.param("origin", null),
        birthday: req.param("birthdate", null),
        usageNote: req.param("usageNote"),
        usageFrequency: req.param("usage", null),
        referral: req.param("referral", null),
        passwordToHash: req.param("passwordToHash"),
        confPassword: req.param("confPassword")
    };
    self.registerNewUser(profile, function (err, result) {
        if (err) {
            return res.error(err);
        }
        res.send(result);
    });
}
;
module.exports = registerUser;
