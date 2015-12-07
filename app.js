var express = require('express');
var server  = require('./server');
var config  = require('./config/index');
var i18n    = require('i18n');

var app = express();

app.engine('ejs', require('ejs-locals'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

i18n.configure(config.get('i18n'));

app.use(express.static(__dirname + '/public'));
app.use('/en', express.static(__dirname + '/public'));
app.use('/ru', express.static(__dirname + '/public'));
app.use('/uk', express.static(__dirname + '/public'));

app.use(i18n.init);

app.get('/', function (req, res, next) {
    res.render('main', config.get('websiteCustomData'));
});
app.get('/en', function (req, res, next) {
    res.setLocale('en');
    res.render('main', config.get('websiteCustomData'));
});
app.get('/ru', function (req, res, next) {
    res.setLocale('ru');
    res.render('main', config.get('websiteCustomData'));
});
app.get('/uk', function (req, res, next) {
    res.setLocale('uk');
    res.render('main', config.get('websiteCustomData'));
});
app.get('/favicon.ico', function (req, res, next) {
    res.sendFile(__dirname + '/public/img/favicon.ico');
});

// Error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            status: err.status || 500,
            message: err.message,
            error: err
        });
        console.error(err);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        status: err.status || 500,
        message: err.message,
        error: {}
    });
});

//app.use(function(err, req, res, next) {
//    if (typeof err == 'number') {
//        err = new HttpError(err);
//    }
//
//    if (err instanceof HttpError) {
//        res.sendHttpError(err);
//    } else {
//        if (app.get('env') == 'development') {
//            app.use(errorHandler(err, req, res, next));
//        } else {
//            log.error(err);
//            err = new HttpError(500);
//            res.sendHttpError(err);
//        }
//    }
//});

server(app);