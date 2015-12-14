var express = require('express');
var server = require('./server');
var config = require('./config/index');
var i18n = require('i18n');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');
var favicon = require('serve-favicon');

var app = express();

app.engine('ejs', require('ejs-locals'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

i18n.configure(config.get('i18n'));

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(cookieParser());
app.use(i18n.init);
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res, next) {
    if (config.get('websiteMaintenance')) {
        res.render('coming-soon', { useLayout: true });
    } else {
        res.cookie('lang', req.getLocale(), { maxAge: 30*24*60*60*1000, httpOnly: true });
        res.render('main', { useLayout: true, data: config.get('websiteCustomData') });
    }
});
app.get('/set', function (req, res, next) {
    if(req.query.locale != undefined) {
        res.cookie('lang', req.query.locale, { maxAge: 30*24*60*60*1000, httpOnly: true });
        res.setLocale(req.query.locale);
        res.render('main', { useLayout: false, data: config.get('websiteCustomData') }, function (err, html) {
            res.send({
                html: html,
                title: res.__('title')
            });
        });
    }
});
app.post('/send', function (req, res, next) {
    nodemailer.createTransport().sendMail({
        from: 'Rebootex Coming Soon Page <website@rebootex.com.ua>',
        to: 'doctor@rebootex.com.ua',
        subject: 'Новое сообщение с сайта!!!',
        html:
            '<b>Name: </b>' + req.body.name + '<br>' +
            '<b>Phone: </b> +380' + req.body.phone + '<br>' +
            '<b>Email: </b>' + req.body.email + '<br>' +
            '<b>Issue: </b>' + req.body.issue + '<br>' +
            '<b>Message: </b>' + req.body.message + '<br>'
    }, function(err, data){
        if(err){
            return res.send(err);
        }
        res.send(data);
    });
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

server(app);