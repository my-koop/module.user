var getLogger = require("mykoop-logger");
var logger = getLogger(module);
function getUserProfileCommon(params) {
    var req = params.req;
    var res = params.res;
    var isFullProfile = params.fullProfile;
    var id = parseInt(req.param("id", -1));
    if (id === -1) {
        return res.send(400);
    }
    var self = this;
    self.getProfile({ id: id }, function (err, profile) {
        if (err) {
            return res.error(err);
        }
        // We at least want to return an empty object ("no permissions") to
        // faciliate many operations.
        if (profile.permissions === null) {
            profile.permissions = {};
        }
        //FIXME: We might want to have a constructive "whitelist" approach to the
        // public profile rather than a "blacklist" destructive approach to the
        // full profile. Separated from the default object logic above for that
        // reason.
        if (!isFullProfile) {
            delete profile.permissions;
        }
        res.send({
            userProfile: profile
        });
    });
}
;
function getFullProfile(req, res) {
    getUserProfileCommon.call(this, { req: req, res: res, fullProfile: true });
}
exports.getFullProfile = getFullProfile;
;
function getPublicProfile(req, res) {
    getUserProfileCommon.call(this, { req: req, res: res });
}
exports.getPublicProfile = getPublicProfile;
;
