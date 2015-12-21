var validator = require('validator');

validator.extend('isPhoneNumber', function (str) {
    return /[\d+\s+\-+\)+\(+\.+\+]{9,15}/igm.test(str) && !validator.isEmptyOrWhitespace(str);
});

validator.extend('isEmptyOrWhitespace', function (str) {
    return str.length == 0 || /^\s+$/.test(str);
});

module.exports = validator;