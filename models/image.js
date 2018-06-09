var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.database);

var Schema = mongoose.Schema;

module.exports = mongoose.model('Image', new Schema({
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
}));

module.exports.createImage = function (newImage, callback) {
    newImage.save(callback);
}
