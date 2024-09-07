var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require('dotenv').config();
var sequelize = require("./db/dbConnection");
var usersRouter = require("./routes/users");
var courseRouter = require("./routes/courses");
var studentRouter = require("./routes/students");
var enrollmentRouter = require("./routes/enrollments");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/students", studentRouter);
app.use("/courses", courseRouter);
app.use("/enrollments", enrollmentRouter);

sequelize
  .sync({ force: false }) // Don't drop tables
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
