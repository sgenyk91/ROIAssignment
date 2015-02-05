var express    = require('express');
var ejs        = require('ejs');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var flash        = require('connect-flash');
var morgan       = require('morgan');
var session      = require('express-session');

module.exports = {
  view: viewMiddleware,
  express: expressMiddleware,
  passport: passportMiddleware
};

function viewMiddleware(app) {
  app.use(express.static(__dirname + '/../../client'));
  app.set('views', __dirname + '/../../client/views');
  app.engine('html', ejs.renderFile);
  app.set('view engine', 'html');
}

function expressMiddleware(app) {
  app.use(setCors);
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(morgan('dev'));
}

function passportMiddleware(app, passport) {
  app.use(session({ secret: 'secret' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
}

function setCors(req, res, next) {
  res.set(defaultCorsHeaders);
  if (req.method === 'OPTIONS') {
    return res.send(200);
  }
  next();
}

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Allow": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 120
};