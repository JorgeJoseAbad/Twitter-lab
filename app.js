/* jshint esversion:6 */
require("dotenv").config();
const session =require("express-session");
const MongoStore = require("connect-mongo")(session);
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');

mongoose.Promise=global.Promise;

const index = require('./routes/index');
const users = require('./routes/users');
const authController = require('./routes/authController');
const tweetsController = require("./routes/tweetsController");
const timelineController = require("./routes/timelineController");
const profileController  = require("./routes/profileController");

const app = express();

mongoose.connect(process.env.MONGODB_URI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set("layout", "layouts/main-layout");



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "basic-tweet-secret",
    cookie: { maxAge: 600000 },
    store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  resave: true,
  saveUninitialized: true
}));



app.use("/", authController);
app.use("/tweets", tweetsController);
app.use("/profile", profileController);
app.use('/timeline', timelineController);

app.use('/', index);
app.use('/users', users);


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
