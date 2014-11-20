var getLogger = require("mykoop-logger");
var logger = getLogger(module);
function attachSessionUserId(req, res, next) {
    res.locals.userId = req.session.user.id;
    next();
}
;
module.exports = attachSessionUserId;
