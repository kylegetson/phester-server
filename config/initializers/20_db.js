var Sequelize = require('sequelize');

// the application is executed on the local machine ... use mysql
var sequelize = new Sequelize('gds', 'root', null);
var modelPath = __dirname + '/../../app/models';
var registry = require(modelPath);

// register each sequelize model...
registry.register(sequelize.import(modelPath + '/user'));
registry.register(sequelize.import(modelPath + '/question'));
registry.register(sequelize.import(modelPath + '/answer'));

module.exports = function (done) {
  sequelize.sync()
    .then(function () {
      done();
    })
    .catch(function (error) {
      done(error);
    });
}