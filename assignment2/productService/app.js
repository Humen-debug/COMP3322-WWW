var cors = require("cors");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");

// use lab6-db
var monk = require("monk");
var db = monk("127.0.0.1:27017/assignment2");

var productRouter = require("./routes/products");

var app = express();
app.use(cors());
// view engine setup
app.engine("pug", require("pug").__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Make our db accessible to routers
app.use(function (req, res, next) {
    req.db = db;
    next();
});
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,OPTIONS,POST,PUT,DELETE",
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use("/", productRouter);

app.all(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", true);
    res.header.append("Content-Type", "application/json");
    next();
});

// for requests not matching the above routes, create 404 error and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development environment
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

// module.exports = app;
var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Assignment2 server listening at http://%s:%s", host, port);
});
