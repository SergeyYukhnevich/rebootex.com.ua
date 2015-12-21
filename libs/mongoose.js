var mongoose = require('mongoose');
var config = require('../config');

var env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';

mongoose.connect(config.get('mongoose:' + env + ':uri'), config.get('mongoose:options'));

module.exports = mongoose;