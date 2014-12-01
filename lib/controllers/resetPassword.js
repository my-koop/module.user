var getLogger = require("mykoop-logger");
var logger = getLogger(module);
function resetPassword(req, res) {
    this.resetPassword(req.param("email"), function (err) {
        if (err) {
            return res.error(err);
        }
        res.end();
    });
}
;
module.exports = resetPassword;
