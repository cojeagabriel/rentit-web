var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var bcrypt = require('bcrypt-nodejs');
var config = require('../config');
mongoose.connect(config.database);

var Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
    _senderId: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    senderFirstName: {
        type: String,
    },
    senderLastName: {
        type: String,
    },
    _recieverId: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
    dateYear: {
        type: Number,
    },
    dateMonth: {
        type: Number,
    },
    dateDay: {
        type: Number,
    },
    dateHour: {
        type: Number,
    },
    dateMinute: {
        type: Number,
    },
}));

module.exports.createMessage = function (newMessage, callback) {
    newMessage.save(callback);
}
