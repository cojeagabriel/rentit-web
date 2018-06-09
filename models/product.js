var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var bcrypt = require('bcrypt-nodejs');
var config = require('../config');
mongoose.connect(config.database);

var Schema = mongoose.Schema;

module.exports = mongoose.model('Product', new Schema({
    title: {
        type: String,
        required: true
    },
    _ownerId: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Tools', 'Gardening']
    },
    description: {
        type: String
    },
    quantity: {
        type: Number,
        required: true
    },
    available: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    pricePer: {
        type: String,
        required: true,
        enum: ['Hour', 'Day', 'Week', 'Month']
    },
    images: [new Schema({
        fileName: {
            type: String,
            required: true
        },
        mimeType: {
            type: String,
            required: true,
            enum: [
                'image/gif',
                'image/png',
                'image/jpeg',
                'image/bmp'
            ]
        },
        size: {
            type: Number,
            required: true
        }
    })]
}));

module.exports.createProduct = function (newProduct, callback) {
    newProduct.save(callback);
}
