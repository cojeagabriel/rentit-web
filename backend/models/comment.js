var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var bcrypt = require('bcrypt-nodejs');
var config = require('../config');
mongoose.connect(config.database);

var Schema = mongoose.Schema;

module.exports = mongoose.model('Comment', new Schema({
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
    _productId: {
        type: Schema.ObjectId,
        ref: 'Product'
    },
    comment: {
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
    }
}));

module.exports.createComment = function (newComment, callback) {
    newComment.save(callback);
}
