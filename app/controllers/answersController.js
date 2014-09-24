var locomotive = require('locomotive'),
  Controller = locomotive.Controller,
  Answer = require('../models').Answer,
  Question = require('../models').Question,
  AnswersController = new Controller(),
  auth = require('../../config/auth.js'),
  runner = require('../../config/runner.js');


// Ensure logged in
AnswersController.before('*', auth.ensureLoggedIn);


AnswersController.run = function () {
  var self = this;
  var params = this.req.body;

  Question.find(params.questionId)
    .then(function (question) {

      // @todo validate this on input so try/catch no needed
      var testInput = JSON.parse(question.testInput);
      runner(params.input, question.entryFunction, testInput,
        function (err, res) {
          params.output = res.output;
          if (err) {
            params.error = err;
          }
          if (res) {
            params.output = res.output;
            params.error = res.error;
            params.isSuccessful = res.isSuccessful;
          }
          Answer.create(params)
            .then(function (answer) {
              self.res.json({
                result: answer,
                error: null
              });
            })
            .catch(function (error) {
              self.res.json({
                result: null,
                error: error
              });
            });
        });
    })
    .catch(function (error) {
      self.res.json({
        result: null,
        error: error
      });
    });
};


AnswersController.run = function () {
  var self = this;
  var params = this.req.body;

  Question.find(params.questionId)
    .then(function (question) {

      // @todo validate this on input so try/catch no needed
      var testInput = JSON.parse(question.testInput);
      runner(params.input, question.entryFunction, testInput,
        function (err, res) {
          params.output = res.output;
          if (err) {
            params.error = err;
          }
          if (res) {
            params.output = res.output;
            params.error = res.error;
            params.isSuccessful = res.isSuccessful;
            params.isFinal = true;
          }
          Answer.create(params)
            .then(function (answer) {
              self.res.json({
                result: answer,
                error: null
              });
            })
            .catch(function (error) {
              self.res.json({
                result: null,
                error: error
              });
            });
        });
    })
    .catch(function (error) {
      self.res.json({
        result: null,
        error: error
      });
    });
};

module.exports = AnswersController;