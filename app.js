var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var subcategoryRouter = require('./routes/subcategory');
var roleRouter = require('./routes/role');
var employeeRouter = require('./routes/employee');
var projectRouter = require('./routes/project');
var assignprojectRouter = require('./routes/assignproject');
var timesheetRouter = require('./routes/timesheet');
var expensesRouter = require('./routes/expenses');
var expensesmanagerRouter = require('./routes/expensesmanager');
var expensescontrollerRouter = require('./routes/expensescontroller');
var controllerRouter = require('./routes/controller');
var managerRouter = require('./routes/manager');
var typeRouter = require('./routes/type');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/category', categoryRouter);
app.use('/subcategory', subcategoryRouter);
app.use('/role', roleRouter);
app.use('/employee', employeeRouter);
app.use('/project', projectRouter);
app.use('/assignproject', assignprojectRouter);
app.use('/timesheet', timesheetRouter);
app.use('/expenses', expensesRouter);
app.use('/expensesmanager', expensesmanagerRouter);
app.use('/expensescontroller', expensescontrollerRouter);
app.use('/controller', controllerRouter);
app.use('/manager', managerRouter);
app.use('/type', typeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
