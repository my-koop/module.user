var getLogger = require("mykoop-logger");
var logger = getLogger(module);
function updatePassword(req, res) {
    var id = res.locals.userId;
    var passwords = {
        newPassword: req.param("newPassword"),
        confNewPassword: req.param("confNewPassword"),
        oldPassword: req.param("oldPassword")
    };
    this.updatePassword(id, passwords, function (err) {
        if (err) {
            return res.error(err);
        }
        res.end();
    });
}
;
module.exports = updatePassword;
