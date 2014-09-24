var locomotive = require('locomotive'),
  Controller = locomotive.Controller,
  User = require('../models').User,
  bcrypt = require('bcrypt'),
  UsersController = new Controller(),
  passport = require('passport'),
  auth = require('../../config/auth.js');

// Ensure admin for all
UsersController.before('*', auth.ensureAdmin);

UsersController.index = function () {
  var self = this;

  // load all Users
  User.findAll()
    .then(function (users) {
      self.res.json(users);
    })
    .catch(function (error) {
      self.res.json(error);
    });

};

UsersController.new = function () {
  this.render({
    user: {}
  });
};

UsersController.create = function () {
  var self = this;
  var params = this.req.body;
  var path = this.usersPath();
  var newPath = this.newUserPath();

  // Replace password with a bcrypted ond
  params.password = bcrypt.hashSync(params.password, 4);

  User.create(params)
    .then(function (user) {
      self.redirect(path);
    })
    .catch(function (error) {
      self.req.flash('error', JSON.stringify({
        error: error.message,
        info: error.errors
      }));
      self.redirect(newPath);
    });
};

UsersController.show = function () {
  var self = this;
  var id = this.param('id');

  User.find(id)
    .then(function (user) {
      if (!user) return self.res.send(404);
      self.respond({
        'json': function () {
          self.res.json({
            user: user
          });
        },
        default: function () {
          self.render({
            user: user
          });
        }
      });
    })
    .catch(function (error) {
      self.respond({
        'json': function () {
          self.res.json({
            user: null,
            error: error
          });
        },
        default: function () {
          self.next(error);
        }
      });
    });
};

UsersController.edit = function () {
  var self = this;
  var id = this.param('id');

  User.find(id)
    .then(function (user) {
      if (!user) return self.next(new Error('entity not found'));
      self.render({
        user: user
      });
    })
    .catch(function (error) {
      self.next(error);
    });
};

UsersController.update = function () {
  var self = this;
  var params = this.req.body;
  var id = this.param('id');
  var path = this.usersPath();
  var editPath = this.editUserPath(id);

  User.find(id)
    .success(function (user) {
      // Check for new password (vs resubmission of existing hash)
      if (user.password !== params.password) {
        params.password = bcrypt.hashSync(params.password, 4);
      }
      user.updateAttributes(params)
        .success(function () {
          self.redirect(path);
        })
        .error(function (error) {
          self.req.flash('error', JSON.stringify({
            error: error.message,
            info: error.errors
          }));
          self.redirect(editPath);
        });
    })
    .error(function (error) {
      self.req.flash('error', 'Something went wrong! ' + error);
      self.redirect(editPath);
    });
};

module.exports = UsersController;