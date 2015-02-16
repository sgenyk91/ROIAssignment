// var confirmation = require('./config/confirm');
// var sendMessage  = require('./config/mailer');
var util = require('./util');

module.exports = {
  route: routeMiddleware
};

function routeMiddleware(app, passport) {

  app.get('/', function(req, res) {
    res.render('home');
  });

  // app.get('/login', function(req, res) {
  //   res.render('login'); 
  // });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }));

  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/confirmation',
    failureRedirect: '/signup'
  }));

  app.get('/profile', isLoggedIn, isConfirmed, function(req, res) {
    res.render('profile', {
      user: req.user
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/confirmation', function(req, res) {
    res.render('confirmation');
  });

  app.get('/confirmed', function(req, res) {
    console.log("CONFIRMED REQ: ", req.query);
    var email = req.user.local.email;
    var id = req.query.id;
    util.confirmUser(email, id);
    res.redirect('/profile');
  });

  app.get('/forgot', function(req, res) {
    res.render('forgot', {
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
    var email = req.user.facebook.email;
    util.successMessage(email);
    res.redirect('/profile');
  });

  app.get('/twitter', passport.authenticate('twitter'));

  app.get('/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signup'
  }), function(req, res) {
    console.log("TWITTER REQ: ", req);
    var textToTweet = 'Welcome to ROI Assignment!';
    // 'http://twitter.com/home?status=' + encodeURIComponent(textToTweet);
    res.redirect('/profile');
  });
}

function isLoggedIn(req, res, next) {
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