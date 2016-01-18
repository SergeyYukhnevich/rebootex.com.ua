var express = require('express');
var server = require('./libs/server');
var config = require('./config/index');
var log = require('./libs/log')(module);
var i18n = require('i18n');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var sendMail = require('./controllers/sendMailController');
var favicon = require('serve-favicon');
var errorHandler = require('errorhandler');
var HttpError = require('./controllers/errorController').HttpError;
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
app.use(require('./controllers/errorController').sendHttpError);
app.use(require('./controllers/errorController').sendValidationError);

app.use('/', sendMail);

app.get('/', function (req, res, next) {
    if (config.get('websiteMaintenance')) {
        res.render('coming-soon', { useLayout: true, data: config.get('websiteCustomData') });
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
app.get('/.well-known/acme-challenge/kany3MSdc8rRdNrIOxrZDc9CsmCSkd9YziI2tAEaslk', function (req, res, next) {
    res.send('kany3MSdc8rRdNrIOxrZDc9CsmCSkd9YziI2tAEaslk.sOsj0DY_jukL8xBTVw35C632-WdM7gc52QdVCsuGpGg');
});

// Error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(404);
});

app.use(function(err, req, res, next) {
    if (typeof err == 'number') {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            app.use(errorHandler())(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});

server(app);