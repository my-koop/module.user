var getLogger = require("mykoop-logger");
var logger = getLogger(module);

function updatePassword(req, res) {
    var id = parseInt(req.param("id", -1));
    if (id === -1) {
        return res.send(400);
    }
    var passwords = {
        newPassword: req.param("newPassword"),
        confNewPassword: req.param("confNewPassword"),
        oldPassword: req.param("oldPassword")
    };
    var self = this;
    self.updatePassword(id, passwords, function (err, success) {
        if (err) {
            return res.status(500).send(err.toString());
        }

        res.send({
            updateSuccess: success
        });
    });
}
;

module.exports = updatePassword;
