var express = require('express'),
  poweredBy = require('connect-powered-by'),
  passport = require('passport'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  RedisStore = require('connect-redis')(session),
  timeout = require('connect-timeout'),
  logger = require('express-logger'),
  favicon = require('express-favicon'),
  flash = require('express-flash');


module.exports = function () {
  // Use middleware.  Standard [Connect](http://www.senchalabs.org/connect/)
  // middleware is built-in, with additional [third-party](https://github.com/senchalabs/connect/wiki)
  // middleware available as separate modules.
  if ('development' == this.env) {
    this.use(logger({
      path: "./log/debug.log"
    }));
  }

  var secret = 'Gold3nD00rCOOK!eZZ';
  this.use(poweredBy('Locomotive'));
  this.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    next();
  });
  this.use(favicon(__dirname + '/../../public/favicon.ico'));
  this.use(express.static(__dirname + '/../../public'));
  this.use(bodyParser.urlencoded({
    extended: false
  }))
  this.use(bodyParser.json())
  this.use(session({
    secret: secret,
    name: 'gdsessid',
    store: new RedisStore({
      host: '127.0.0.1',
      port: '6379'
    }),
    resave: true,
    saveUninitialized: true
  }));
  this.use(flash());
  this.use(passport.initialize());
  this.use(passport.session());
  this.use(this.router);
}