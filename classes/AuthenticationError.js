var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils = require("mykoop-utils");

var AuthenticationError = (function (_super) {
    __extends(AuthenticationError, _super);
    function AuthenticationError(err, msg) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 2); _i++) {
            args[_i] = arguments[_i + 2];
        }
        _super.call(this, err, msg, args);
    }
    AuthenticationError.prototype.serialize = function () {
        return {
            context: "authentication"
        };
    };
    return AuthenticationError;
})(utils.errors);

module.exports = AuthenticationError;
