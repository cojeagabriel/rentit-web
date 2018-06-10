var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var config = require('../config');
mongoose.connect(config.database);

var Schema = mongoose.Schema;

var Counter = new mongoose.Schema({
    _userId: { 
        type: Schema.ObjectId, 
        required: true 
    },
    count: {
        type: Number,
        default: 0
    }
});

// Counter.plugin(autoIncrement.plugin, {
//     model: 'Counter',
//     field: 'count',
//     startAt: 0
// });

module.exports = mongoose.model('Counter', Counter);