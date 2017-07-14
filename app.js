const chain2 = require('chain-sdk');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var googleStocks = require('google-stocks');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest2');

var index = require('./routes/index');
var chain = require('./routes/chain');
var users = require('./routes/users');
var stocks = require('./routes/stocks')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/chain', chain);
app.use('/stocks', stocks);

app.use('/users', users);
app.use('/', index);




console.log("here1!\n")
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("ERRORR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n")
  var err = new Error('Not Found');
  err.status = 404;

    console.log("Our error: ")
    console.log(err)
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
