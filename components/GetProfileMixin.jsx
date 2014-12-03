var React = require('react');

var actions = require("actions");

module.exports = {
  getInitialState: function() {
    return {
      __profileData: null,
      __idUser: null,
      __remoteProfileError: null
    };
  },

  getUserId: function() {
    return this.state.__idUser;
  },

  getUserProfile: function() {
    return this.state.__profileData;
  },

  getRemoteProfileError: function() {
    return this.state.__remoteProfileError;
  },

  // params: {userId: number; silent?: boolean}
  // callback?: (err, profile, userId) => void
  getRemoteProfile: function(params, callback) {
    var userId = params.userId;
    var self = this;
    var action = this.props.current ?
      actions.user.getPublicProfile
    : actions.user.getFullProfile;

    action(
      {
        silent: params.silent,
        data: {
          id: userId
        }
      },
      function(err, result) {
        var profile = !err && result ? result.userProfile : null;
        profile.birthdate = profile.birthdate ? new Date(profile.birthdate) : null;
        if(profile.birthdate && isNaN(profile.birthdate.getTime())) {
          profile.birthdate = null;
        }
        if(profile.birthdate) {
          profile.birthdate.setTime(
            profile.birthdate.getTime() +
            new Date(profile.birthdate.getTimezoneOffset()*60*1000).getTime()
          );
        }
        self.setState({
          __profileData : profile,
          __idUser: profile ? userId : null,
          __remoteProfileError: err
        }, function() {
          callback && callback(
            self.getRemoteProfileError(),
            self.getUserProfile(),
            self.getUserId()
          );
        });
      }
    );
  }
}
