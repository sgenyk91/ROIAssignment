var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var User             = require('../model/user');
var keys             = require('../../keys');
var util             = require('../util');

module.exports = {
  passport: passportModification
};

function passportModification(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

/************** SIGNUP **************/
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  }, function(req, email, password, done) {

    process.nextTick(function() {

      User.findOne({ 'local.email':  email }, function(err, user) {

        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, false);
        } else {
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.local.id = newUser.generateHash(email);
          newUser.local.confirmed = false;
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
          util.confirmationMessage(email, newUser.local.id);
        }
      });    
    });
  }));

/************** LOGIN **************/
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  }, function(req, email, password, done) {

    User.findOne({ 'local.email':  email }, function(err, user) {

      if (err) {
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        return done(null, false);
      }

      return done(null, user);
    });
  }));

/************** FACEBOOK **************/
  passport.use(new FacebookStrategy({
    clientID: keys.facebook.id,
    clientSecret: keys.facebook.secret,
    callbackURL: keys.facebook.callback
  },
  function(token, refreshToken, profile, done) {

    console.log("FACEBOOK PROFILE: ", profile);
    process.nextTick(function() {

      User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        } else {

          var newUser = new User();
          newUser.facebook.id = profile.id;         
          newUser.facebook.token = token;                
          newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
          newUser.facebook.email = profile.emails[0].value;

          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

/************** TWITTER **************/
  passport.use(new TwitterStrategy({
      consumerKey: keys.twitter.key,
      consumerSecret: keys.twitter.secret,
      callbackURL: keys.twitter.callback
  },
  function(token, tokenSecret, profile, done) {
    console.log("TWITTER PROFILE: ", profile);
    process.nextTick(function() {

      User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.twitter.id = profile.id;
          newUser.twitter.token = token;
          newUser.twitter.username = profile.username;
          newUser.twitter.displayName = profile.displayName;

          newUser.save(function(err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
          });
        }
      });
    });
  }));
}