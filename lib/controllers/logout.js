var getLogger = require("mykoop-logger");
var logger = getLogger(module);
function logout(req, res) {
    delete req.session.user;
    res.sendStatus(200);
}
module.exports = logout;
