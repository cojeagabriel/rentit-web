// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var bcrypt = require('bcrypt-nodejs');
var config = require('../config');
mongoose.connect(config.database);

var Schema = mongoose.Schema;

var firstNameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'First name should be between {ARGS[0]} and {ARGS[1]} characters',
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z]{3,15}$/,
        message: 'Must contain only letters'
    })
]

var lastNameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Last mame should be between {ARGS[0]} and {ARGS[1]} characters',
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z]{3,15}$/,
        message: 'Must contain only letters'
    })
]

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'It is not a valid email'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters',
    })
]

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    firstName: {
        type: String,
        required: true,
        validate: firstNameValidator
    },
    lastName: {
        type: String,
        required: true,
        validate: lastNameValidator
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        validate: emailValidator
    },
    telephone: {
        type: Number,
        required: false,
        min: [1000000000, 'Number must have 10 digits'],
        max: [9999999999, 'Number must have 10 digits']
    },
    password: {
        type: String,
        required: true
    },
    admin: Boolean
}));

module.exports.getUserById = function (id, callback){
    User.findById(id, callback);
}

module.exports.createUser = function (newUser, callback) {
    bcrypt.hash(newUser.password, null, null, function (err, hash) {
        if (err) {
            throw err;
        }
        newUser.password = hash;
        newUser.save(callback);
    });
}