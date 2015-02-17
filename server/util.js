var mandrill = require('mandrill-api/mandrill');
var User     = require('./model/user');
var keys     = require('../keys');
var email    = new mandrill.Mandrill(keys.mandrill.APIKey);

module.exports = {
  changePassword: changePassword,
  confirmationMessage: confirmationMessage,
  confirmUser: confirmUser,
  successMessage: successMessage,
  sentEmail: sentEmail,
  sentTweet: sentTweet
};

function confirmationMessage(email, id) {
  var params = {
    "message": {
      "from_email":"sgenyk91@gmail.com",
      "to":[{"email":email}],
      "subject": "Confirmation Email",
      "html": "<a href='http://localhost:3000/confirmed?email="+email+"&id="+id+"'>Click here to confirm email</a>",
      "autotext": "true",
      "track_opens": "true",
      "track_clicks": "true"
    }
  };
  sendEmail(params);
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
  };
  sendEmail(params);
}


function sendEmail(params) {
  email.messages.send(params, function(res) {
    log(res);
  }, function(err) {
    log(err);
  });
}

function log(obj) {
  console.log("OBJ: ", obj);
}

function confirmUser(email, id) {
  User.findOne({'local.email': email}, function(err, user) {
    if (err) {
      console.log(err);
    }

    if (user.local.id === id) {
      successMessage(email);
      user.local.confirmed = true;
      user.save(function(err, product, numberAffected) {
        if(err) {
          console.log(err);
        }
        console.log("SNARF", product, numberAffected);
      });
    }

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
    });
  });
}

function sentEmail(email) {
  User.findOne({'facebook.email': email}, function(err, user) {
    if (err) {
      console.log(err);
    }
    user.facebook.sentEmail = true;

    user.save(function(err, product, numberAffected) {
      console.log("FACEBOOK WOOHOO!");
      if (err) {
        console.log(err);
      }
    });
  });
}

function sentTweet(username) {
  User.findOne({'twitter.username': username}, function(err, user) {
    if (err) {
      console.log(err);
    }
    user.twitter.sentTweet = true;

    user.save(function(err, product, numberAffected) {
      console.log("WOOHOO!");
      if (err) {
        console.log(err);
      }
    });
  });
}