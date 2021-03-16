var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieparser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

// console.log(db.collection("users"));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var testAPIRouter = require('./routes/testAPI');
var weatherRouter = require('./routes/weather');
var stockRouter = require('./routes/stock');
var friendshipRouter = require('./routes/friendships');
// var withAuth = require('./routes/middleware')

require('dotenv').config();
const secret = process.env.SECRET;

var app = express();
const uri = process.env.ATLAS_URI;
var db = mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;


connection.once('open', () => {
    console.log("MongoDB connection successful");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');  

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Origin', "*");
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept Set-Cookie');
//   next();
// });

// var handleCors = function(req, res, next) {
//   res.set("Access-Control-Allow-Origin", "*");
//   res.set("Access-Control-Allow-Credentials", 'true');
//   // res.set("")
//   // res.status(204).end();
//   next();
// }
app.use(cookieparser());
app.use(cors(
  {
//     AccessControlAllowOrigin: "*",
    // preflightContinue: true,
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// // //   //   // preflightContinue: true,
// // //   //   optionsSuccessStatus: 204,
    credentials: true,
    // allowedHeaders: ["Authorization", 'Content-Type', 'Set-Cookie'],
  }
  ));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/friendships', friendshipRouter);
app.use('/weather', weatherRouter, cors());
app.use('/stock', stockRouter);
app.get('/checkToken', (req, res) => {

  const token = req.query.token;
  const bearer = token.split(' ');
  const bearerToken = bearer[1];
  
  jwt.verify(bearerToken, secret, (err, payload) => {
      if (err) { return res.sendStatus(403); }
      res.status(200).json(payload);
  });

});

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
