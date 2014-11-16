var getLogger = require("mykoop-logger");
var logger = getLogger(module);

function getSession(req, res) {
    var session = req.session.user;

    if (!session) {
        return res.send({});
    }

    res.send({
        id: session.id,
        email: session.email
    });
}
;

module.exports = getSession;
