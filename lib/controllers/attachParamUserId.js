var getLogger = require("mykoop-logger");
var logger = getLogger(module);
function attachParamUserId(req, res, next) {
    res.locals.userId = req.param("id");
    next();
}
;
module.exports = attachParamUserId;
