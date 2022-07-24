var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieparser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
var upload = require('./storage/upload')
// const multer = require('multer');
// const multerS3 = require('multer-s3')
// // var upload = multer();

require('dotenv').config();
const secret = process.env.SECRET;

// var AWS = require('aws-sdk')
// let config = JSON.parse(process.env.config)
// const s3 = new AWS.S3(config)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var testAPIRouter = require('./routes/testAPI');
var weatherRouter = require('./routes/weather');
var stockRouter = require('./routes/stock');
var friendshipRouter = require('./routes/friendships');
var preferenceRouter = require('./routes/preferences'); 
var profileRouter = require('./routes/profiles');
var requestRouter = require('./routes/friend-requests');
var postRouter = require('./routes/feed');
var messageRouter = require('./routes/messages');
// var withAuth = require('./routes/middleware')

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
app.use(cookieparser());
app.use(cors(
  {
    AccessControlAllowOrigin: "http://localhost:3000",
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
// app.use(upload.array());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/friendships', friendshipRouter);
app.use('/weather', weatherRouter, cors());
app.use('/stock', stockRouter);
app.use('/preferences', preferenceRouter);
app.use('/profiles', profileRouter);
app.use('/friend-requests', requestRouter);
app.use('/feed', postRouter);
app.use('/messages', messageRouter);
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
