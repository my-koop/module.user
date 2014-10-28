function tryLogin(req, res) {
    var self = this;
    var email = req.param("email", null);
    var passwordHash = req.param("pwdhash", null);
    if (!email || !passwordHash) {
        return res.send(400);
    }

    self.tryLogin(email, passwordHash, function (err, isLogin) {
        if (err) {
            res.send(500);
            return;
        }

        res.send({
            isLogin: isLogin
        });
    });
}
;

module.exports = tryLogin;
