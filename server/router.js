var Twit = require('twit');
var util = require('./util');
var keys = require('../keys');

module.exports = {
  route: routeMiddleware
};

var T = new Twit({
  consumer_key: keys.twitter.key,
  consumer_secret: keys.twitter.secret,
  access_token: keys.twitter.accessToken,
  access_token_secret: keys.twitter.accessTokenSecret
});

function routeMiddleware(app, passport) {

  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/login', function(req, res) {
    res.render('index'); 
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }));

  app.get('/signup', function(req, res) {
    res.render('index');
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/confirmation',
    failureRedirect: '/signup'
  }));

  app.get('/profile', isLoggedIn, isConfirmed, function(req, res) {
    res.render('index', {
      user: req.user
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    console.log("LOGOUT: ", req.isAuthenticated());
    res.render('index');
  });

  app.get('/confirmation', function(req, res) {
    res.render('index');
  });

  app.get('/confirmed', function(req, res) {
    var email = req.user.local.email;
    var id = req.query.id;
    util.confirmUser(email, id);
    res.redirect('/profile');
  });

  app.get('/forgot', function(req, res) {
    res.render('index', {
      user: req.user
    });
  });

  app.post('/forgot', function(req, res) {
    var email = req.user.local.email;
    var newPassword = req.body.password;
    util.changePassword(email, newPassword);
    res.redirect('/login');
  });

  app.get('/facebook', passport.authenticate('facebook', { scope : 'email' }));

  app.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signup'
  }), function(req, res) {
    if (!req.user.facebook.sentEmail) {
      var email = req.user.facebook.email;
      util.successMessage(email);
      util.sentEmail(email);
    }
    res.redirect('/profile');
  });

  app.get('/twitter', passport.authenticate('twitter'));

  app.get('/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signup'
  }), function(req, res) {
    if (!req.user.twitter.sentTweet) {
      T.post('statuses/update', {status: '@' + req.user.twitter.username + ' Welcome to ROI Assignment!'}, function(err, data, response) {
        console.log("TWTTIER ERROR: ", err);
      });
      util.sentTweet(req.user.twitter.username);
    }
    res.redirect('/profile');
  });
}

function isLoggedIn(req, res, next) {
  console.log("LOGGED IN: ", req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function isConfirmed(req, res, next) {
  var user = req.user.local;
  if (user.email == undefined || user.confirmed) {
    return next();
  }
  res.redirect('/');
}