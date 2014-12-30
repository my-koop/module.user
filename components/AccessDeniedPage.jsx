var React = require("react");

var Link = require("react-router").Link;

var MKAlert = require("mykoop-core/components/Alert");

var __ = require("language").__;

var localSession = require("session").local;

var AccessDeniedPage = React.createClass({
  render: function() {
    return (
      <div>
        <p>
          <MKAlert bsStyle="danger" permanent>
            {__("user::access_denied")}
            {!localSession.user ?
              <span>
                {" "}{__("user::access_denied_login")}{" "}
                <Link to="login">{__("user::login_link")}</Link>?
              </span> :
              null
            }
          </MKAlert>
        </p>
      </div>
    );
  }
});

module.exports = AccessDeniedPage;
