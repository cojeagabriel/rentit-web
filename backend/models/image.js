var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.database);

var Schema = mongoose.Schema;

module.exports = mongoose.model('Image', new Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    type: {
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
}));

module.exports.createImage = function (newImage, callback) {
    newImage.save(callback);
}
