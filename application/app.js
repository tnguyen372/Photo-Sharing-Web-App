var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('express-handlebars');
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session')(sessions);
var flash = require('express-flash');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var commentRouter = require('./routes/comments');
var dbRouter = require('./routes/dbtest');
var errorPrint = require('./helpers/debug/debugprinters').errorPrint;
var requestPrint = require('./helpers/debug/debugprinters').requestPrint;
var successPrint = require('./helpers/debug/debugprinters').successPrint;

var app = express();
//Configure handlebars engine
app.engine(
    "hbs",
    handlebars({
        layoutsDir: path.join(__dirname, "views/layouts"),
        partialsDir: path.join(__dirname, "views/partials"),
        extname: ".hbs",
        defaultLayout: "home",
        helpers: {
            emptyObject: (obj) => {
                return !(obj.constructor === Object && Object.keys(obj).length === 0);
            }
            /**
             * If you need more helpers you can register them here
             */
        }
    })
);

//MySQL Sessions
var mysqlSessionStore = new mysqlSession({/*Using default options*/}, require('./config/database'));
app.use(sessions({
    key: "cookieID",
    secret: "Reality is often disappointing",
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
//Set express app template engine to handlebars
app.set("view engine", "hbs");

//Unmounted Middleware functions
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    requestPrint(req.url);
    next();
});
//Maintain user session when logged in
app.use((req, res, next) => {
    if (req.session.username) {
        res.locals.logged = true;
    }
    next();
})

//Mounted Middleware functions
//localhost:3000
app.use('/', indexRouter);
app.use('/dbtest', dbRouter);
//localhost:3000/users
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentRouter);

app.use((err, req, res, next) => {
    res.render('error', {err_message: err});
});

app.use((err, req, res, next) => {
    res.status(500);
    res.send('Something went wrong with your database.');
});

module.exports = app;
