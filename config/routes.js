var passport = require('passport');

module.exports = function routes() {

  var auth = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  });

  var authJson = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        return res.send(403);
      }

      req.logIn(user, function(err) {
        if (err) { return next(err); }

        return res.json({
          username: user.username,
          isAdmin: user.isAdmin,
          email: user.email
        });
      });
    })(req, res, next);
  };

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
  this.post('login.json', authJson);


  /**
   * Additional POSTs
   */
  this.post('questions/:id', 'questions#update'); // instead of PUT
  this.post('users/:id', 'users#update'); // instead of PUT
  this.post('answers/run', 'answers#run');
  this.post('answers/submit', 'answers#submit');

}