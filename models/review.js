var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var bcrypt = require('bcrypt-nodejs');
var config = require('../config');
mongoose.connect(config.database);

var Schema = mongoose.Schema;

module.exports = mongoose.model('Review', new Schema({
    _userId: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    userFirstName: {
        type: String,
    },
    userLastName: {
        type: String,
    },
    _productId: {
        type: Schema.ObjectId,
        ref: 'Product'
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    title: {
        type: String
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

module.exports.createReview = function (newReview, callback) {
    newReview.save(callback);
}
