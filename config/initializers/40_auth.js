var express = require('express'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('../../app/models').User,
  bcrypt = require('bcrypt');

module.exports = function () {

  // Define the strategy to be used by PassportJS
  passport.use(new LocalStrategy(
    function (username, password, done) {
      User.find({
        where: {
          username: username
        }
      })
        .then(function (user) {
          if (!user) {
            return done(null, false, {
              message: 'Unknown user'
            });
          }

          bcrypt.compare(password, user.password, function (err, res) {
            if (err || !res) {
              return done(null, false, {
                message: 'Invalid password'
              });
            }
            else {
              done(null, user);
            }
          });

        })
        .catch(function (err) {
          done(err);
        });

    }));

  // Serialized and deserialized methods when got from session
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

};