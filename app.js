var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var database = require('./utils/sql')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mailsRouter = require('./routes/mailbox');
var labelsRouter = require('./routes/labels');



var app = express();
const port = 8000


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var requireToken = function(req, res, next){
  let query = "SELECT email FROM mail_users WHERE session = '"+req.query.session+"'";
  database.query(query, function (err, result){
    if (err) throw err;
    if(result.length > 0 && result[0]['email']){
      res.locals.email = result[0]['email']
      next()
    }else{
      res.json({
        error: "Invalid session key"
      })
    }
  })
}

app.all(['/mails*','/labels*'], requireToken, function(req, res, next){
  next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mails', mailsRouter);
app.use('/labels', labelsRouter);


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
  res.json({ error: err })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})





module.exports = app;

