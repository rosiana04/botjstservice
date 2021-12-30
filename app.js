var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var indexRouter = require('./routes/index');
var api = require("./api/index");

var app = express();

// view engine setup
app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .engine('html', require('ejs').renderFile)
  .set('view engine', 'ejs');


// app.use(logger('dev'));
app.use(express.json())
.use(express.urlencoded({
  extended: false
})).use(cookieParser())
.use(session({
  key: 'user_key',
  secret: 'N2oe+Z9ZzzuDPnr22O8XdkiIt3BCboUizra9L01h2PGbaSp8LwPpLQ64ayxxFsvPuItqlwUV0RL+VirzGD7Xhw==', //double
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 3000000
  }
}));



app.use('/', indexRouter);
app.use('/api', api);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
