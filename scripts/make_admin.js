var env = require('../config/initializers/20_db.js'),
  User = require('../app/models').User,
  bcrypt = require('bcrypt'),
  program = require('commander'),
  util = require('util');

program
  .version('0.0.1')
  .option('-u, --username [username]', 'Username')
  .option('-p, --password [password]', 'Password')
  .option('-e, --email [email]', 'Email Address')
  .parse(process.argv);

if (!program.password || !program.username || !program.email) {
  program.help();
}

// Bootstrap and db.sync, etc.
env(function (err) {

  // Error bootstrapping
  if (err) {
    console.error(err);
    process.exit();
  }

  var hash = bcrypt.hashSync(program.password, 4);

  console.log(util.format('Creating user %s (%s) with password hash %s',
    program.username,
    program.email, hash));

  User.create({
    username: program.username,
    password: hash,
    email: program.email,
    isAdmin: true
  })
    .then(function (u) {
      console.log(util.format('Created userId: %s', u.id));
      process.exit();
    })
    .catch(function (e) {
      console.error(e.parent.message);
      process.exit();
    });

});