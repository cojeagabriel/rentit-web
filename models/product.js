var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var bcrypt = require('bcrypt-nodejs');
var config = require('../config');
mongoose.connect(config.database);

var Schema = mongoose.Schema;

module.exports = mongoose.model('Product', new Schema({
    title: {
        type: String,
        required: true,
        validate: titleValidator
    },
    owner: {
        type: Schema.ObjectId, 
        ref: 'User', 
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Tools', 'Gardening']
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: false
    },
    pricePer: {
        type: String,
        required: true,
        enum: ['Hour', 'Day', 'Week', 'Month']
    },
}));

