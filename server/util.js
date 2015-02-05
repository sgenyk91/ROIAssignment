var mandrill = require('mandrill-api/mandrill');
var User     = require('./model/user');
var keys     = require('../keys');
var email    = new mandrill.Mandrill(keys.mandrill.APIKey);

module.exports = {
  changePassword: changePassword,
  confirmationMessage: confirmationMessage,
  confirmUser: confirmUser,
  successMessage: successMessage
};

function confirmationMessage(email) {
  var params = {
    "message": {
      "from_email":"sgenyk91@gmail.com",
      "to":[{"email":email}],
      "subject": "Confirmation Email",
      "html": "<a href='http://localhost:3000/confirmed?email="+email+"'>Click here to confirm email</a>",
      "autotext": "true",
      "track_opens": "true",
      "track_clicks": "true"
    }
  };
  sendTheMail(params);
}

function successMessage(email) {
  var params = {
    "message": {
      "from_email":"sgenyk91@gmail.com",
      "to":[{"email":email}],
      "subject": "Confirmation Email",
      "html": "<h4>Your registration is complete!</h4>",
      "autotext": "true",
      "track_opens": "true",
      "track_clicks": "true"
    }
  }
  sendTheMail(params);
}


function sendTheMail(params) {
  email.messages.send(params, function(res) {
    log(res);
  }, function(err) {
    log(err);
  });
}

function log(obj) {
  console.log("OBJ: ", obj);
}

function confirmUser(email) {
  User.findOne({'local.email': email}, function(err, user) {
    if (err) {
      console.log(err);
    }
    user.local.confirmed = true;

    user.save(function(err, product, numberAffected) {
      if(err) {
        console.log(err);
      }
      console.log("SNARF", product, numberAffected);
    });
  });
}

function changePassword(email, newPassword) {
  User.findOne({'local.email': email}, function(err, user) {
    if (err) {
      console.log(err);
    }
    user.local.password = user.generateHash(newPassword);

    user.save(function(err, product, numberAffected) {
      if (err) {
        console.log(err);
      }
    })
  })
}