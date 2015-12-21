var express = require('express');
var validator = require('../libs/validator');
var transporter = require('../libs/nodemailer');
var Message = require('../models/message').Message;

var router = express.Router();

router.post('/sendMail', function (req, res, next) {

    var isEmptyOrWhitespace = validator.isEmptyOrWhitespace(req.body.name) || validator.isEmptyOrWhitespace(req.body.phone) || validator.isEmptyOrWhitespace(req.body.email);
    var validPhone = validator.isPhoneNumber(req.body.phone);
    var validEmail = validator.isEmail(req.body.email);

    if (!isEmptyOrWhitespace) {
        if (validPhone) {
            if (validEmail) {
                var message = new Message({
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    issue: req.body.issue,
                    message: req.body.message
                });
                message.save(function (err, message, affected) {
                    if (err) {
                        next(err);
                    } else {
                        transporter.sendMail({
                            from: 'Сообщение со страницы \"Сайт в разработке\" <website@rebootex.com.ua>',
                            to: 'doctor@rebootex.com.ua',
                            subject: 'Новое сообщение с сайта!',
                            html:
                            '<b>Имя: </b>' + req.body.name + '<br>' +
                            '<b>Номер телефона: </b> +380' + req.body.phone + '<br>' +
                            '<b>Адрес электронной почты: </b>' + req.body.email + '<br>' +
                            '<b>Проблема: </b>' + req.body.issue + '<br>' +
                            '<b>Сообщение: </b>' + req.body.message + '<br>'
                        }, function(err, data){
                            if(err){
                                next(err)
                            } else {
                                res.send({
                                    type: 'success',
                                    data: {
                                        title: res.__('notifications.success.title'),
                                        message: res.__('notifications.success.message_sent'),
                                        extra: data
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                res.sendValidationError({
                    title: res.__('notifications.error.title'),
                    message: res.__('notifications.error.invalidEmail')
                });
            }
        } else {
            res.sendValidationError({
                title: res.__('notifications.error.title'),
                message: res.__('notifications.error.invalidPhone')
            });
        }
    } else {
        res.sendValidationError({
            title: res.__('notifications.error.title'),
            message: res.__('notifications.error.emptyFields')
        });
    }

});

module.exports = router;