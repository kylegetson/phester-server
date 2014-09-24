var locomotive = require('locomotive'),
  Controller = locomotive.Controller;

var pagesController = new Controller();

pagesController.main = function () {
  this.title = 'PHester - The PHP Testing Platform';
  this.render();
}

pagesController.login = function () {
  this.render();
}

pagesController.logout = function () {
  this.req.logout();
  this.redirect('/');
}

pagesController.whoami = function () {
  this.res.json({
    identity: this.req.user
  });
}

module.exports = pagesController;