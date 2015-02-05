var config      = require('./config/middleware');
var express     = require('express');
var mongoose    = require('mongoose');
var passport    = require('passport');
var passportMod = require('./config/passport');
var router      = require('./router');

var app = express();

mongoose.connect('mongodb://localhost:27017');

passportMod.passport(passport);
config.view(app);
config.express(app);
config.passport(app, passport);
router.route(app, passport);

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening to port " + port);
});