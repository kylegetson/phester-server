var passport = require('passport');

module.exports = function routes() {

  var auth = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  });

  /**
   * Default
   */
  this.root('pages#main');

  /**
   * REST scaffolding
   */
  this.resources('questions');
  this.resources('users');

  /**
   * User auth
   */
  this.get('login', 'pages#login');
  this.match('logout', 'pages#logout');
  this.match('whoami', 'pages#whoami');
  this.post('login', auth);


  /**
   * Additional POSTs
   */
  this.post('questions/:id', 'questions#update'); // instead of PUT
  this.post('users/:id', 'users#update'); // instead of PUT
  this.post('answers/run', 'answers#run');
  this.post('answers/submit', 'answers#submit');

}