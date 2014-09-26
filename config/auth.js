/**
 * Auth helpers
 */
exports.ensureAdmin = ensureAdmin;
exports.ensureLoggedIn = ensureLoggedIn;

function ensureAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    if (req.params.format !== 'json') {
      res.redirect('/login');
    }
    else {
      res.send(403);
    }
  }
  else {
    return next();
  }
}

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    if (req.params.format !== 'json') {
      res.redirect('/login');
    }
    else {
      res.send(403);
    }
  }
  else {
    return next();
  }
}