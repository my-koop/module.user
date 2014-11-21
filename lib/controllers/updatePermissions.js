var getLogger = require("mykoop-logger");
var logger = getLogger(module);
function updatePermissions(req, res) {
    var userId = req.param("id");
    var newPermissions = req.param("permissions");
    this.updatePermissions(userId, newPermissions, function (err, success) {
        if (err) {
            logger.verbose(err.toString());
            return res.status(500).send(err.toString());
        }
        res.end();
    });
}
;
module.exports = updatePermissions;
