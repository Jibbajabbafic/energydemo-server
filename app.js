var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

// var index = require('./routes/index');

var app = express();

// 'dev' more concise for development
// 'common' or 'combined' more detailed Apache style server logs
var log_format = 'dev';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); // setup morgan to log every request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./auth/passport')(passport); // pass passport for configuration

// setup passport
app.use(session({ 
    secret: 'bikeandhandcrankpower', // session secret
    resave: false, // stop sessions being resaved to sesstion-store
    saveUninitialized: false // disable saving uninitialised sessions
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// use routes in routes/index.js
// app.use('/', index);

// load routes and pass in the app and fully configured passport
require('./routes/routes.js') (app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
