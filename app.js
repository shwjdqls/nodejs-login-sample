var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const login = (req, res, next) => {
  if (req.session.logined) {
    next();
  } else {
    res.redirect('/');
  }
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
	session({
		secret: 'adfsadfasdfsdf',
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 30
		},
		store: new FileStore()
  })
);

app.use('/', indexRouter);
app.use('/users', login, usersRouter);

app.post('/login', (req, res) => {
  const pw = '1234';
  const password = req.body.password;
  if (pw === password) {
    req.session.logined = true;
    req.session.save(() => {
      res.redirect('users');
    });
  } else {
    res.render('index', {
      title: 'Express',
      alert: '비밀번호 다름'
    })
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.redirect('error');
    } else {
      res.redirect('/');
    }
  })
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
