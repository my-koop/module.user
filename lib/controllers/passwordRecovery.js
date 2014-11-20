var getLogger = require("mykoop-logger");
var logger = getLogger(module);
function passwordRecovery(req, res) {
    this.passwordRecovery(req.param("email"), function (err) {
        if (err) {
            return res.error(err);
        }
        res.end();
    });
}
;
module.exports = passwordRecovery;
