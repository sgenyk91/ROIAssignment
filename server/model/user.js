var bcrypt   = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String,
    confirmed: Boolean
  },
  twitter: {
    displayName: String,
    id: String,
    token: String,
    username: String
  },
  facebook: {
    email: String,
    id: String,
    name: String,
    token: String
  }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);