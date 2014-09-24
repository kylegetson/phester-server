var locomotive = require('locomotive'),
  Controller = locomotive.Controller,
  Question = require('../models').Question,
  QuestionsController = new Controller(),
  passport = require('passport'),
  auth = require('../../config/auth.js');

// Ensure logged in
QuestionsController.before('*', auth.ensureLoggedIn);

// Ensure admin for CRUD
QuestionsController.before(['new', 'create', 'edit', 'update'], auth.ensureAdmin);

QuestionsController.index = function () {
  var self = this;

  // load all Users
  Question.findAll()
    .then(function (users) {
      self.res.json(users);
    })
    .catch(function (error) {
      self.res.json(error);
    });

};

QuestionsController.new = function () {
  this.render({
    question: {}
  });
};

QuestionsController.create = function () {
  var self = this;
  var params = this.req.body;
  var path = this.questionsPath();
  var newPath = this.newQuestionPath();
  Question.create(params)
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

QuestionsController.show = function () {
  var self = this;
  var id = this.param('id');

  Question.find(id)
    .then(function (question) {
      if (!question) return self.res.send(404);
      self.respond({
        'json': function () {
          self.res.json({
            question: question
          });
        },
        default: function () {
          self.render({
            question: question
          });
        }
      });
    })
    .catch(function (error) {
      self.respond({
        'json': function () {
          self.res.json({
            question: null,
            error: error
          });
        },
        default: function () {
          self.next(error);
        }
      });
    });
};

QuestionsController.edit = function () {
  var self = this;
  var id = this.param('id');
  var path = this.questionsPath();
  Question.find(id)
    .then(function (question) {

      // Don't know about this guy!
      if (!question) {
        return self.redirect(path);
      }

      self.render({
        question: question
      });

    })
    .catch(function (error) {
      self.redirect(path);
    });
};

QuestionsController.update = function () {
  var self = this;
  var params = this.req.body;
  var id = this.param('id');
  var path = this.questionsPath();
  var editPath = this.editQuestionPath(id);

  Question.find(id)
    .success(function (question) {
      question.updateAttributes(params)
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

module.exports = QuestionsController;