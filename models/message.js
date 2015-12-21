var mongoose = require('../libs/mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    issue: {
        type: String
    },
    message: {
        type: String
    }
});

exports.Message = mongoose.model('Message', schema);