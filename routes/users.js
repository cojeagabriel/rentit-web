const express = require('express');
const router = express.Router();

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');

var config = require('../config');
var requireAuthenticated = require('../require-authenticated');

// Register
router.post('/register', (req, res, next) => {

    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    if (req.body.firstName == '' || req.body.firstName == null || req.body.lastName == '' || req.body.lastName == null || req.body.email == '' || req.body.email == null || req.body.password == '' || req.body.password == null)
    {
        res.status(403).send({success: false, msg: 'Ensure first name, last-name, email and password are provided'});
    }
    else{
        User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (user)
                res.status(403).send({ success: false, msg: 'An user with this email already exists' });
            else if (!user) {
                User.createUser(newUser, (err, user) => {
                    if (err) {
                        if (err.errors.firstName)
                            res.status(403).json({ success: false, msg: err.errors.firstName.message });
                        else if (err.errors.lastName)
                            res.status(403).json({ success: false, msg: err.errors.lastName.message });
                        else if (err.errors.email)
                            res.status(403).json({ success: false, msg: err.errors.email.message });
                        else if (err.errors.password)
                            res.status(403).json({ success: false, msg: err.errors.password.message });
                    } else {
                        const payload = {
                            _id: user._id
                        };
                        var token = jwt.sign(payload, config.secret, {
                            expiresIn: 60 * 60 * 24 // expires in 24 hours
                        });

                        // return the information including token as JSON
                        res.json({
                            success: true,
                            message: 'User registred! Here is your token',
                            token: token
                        });
                    }
                });
                bcrypt.hash(newUser.password, null, null, function (err, hash) {
                    if (err) {
                        throw err;
                    }
                    newUser.password = hash;
                    User.update({ emal: req.body.email }, { password: hash}, function (err, user) {
                        if(err)
                            throw err;
                    });
                });
            }
        });
    }
    
    
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    User.findOne({
        email: req.body.email
    }, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
        } else if (user) {

            bcrypt.compare(req.body.password, user.password, function (err, match) {

                // check if password matches
                if (!match) {
                    res.status(403).send({ success: false, msg: 'Authentication failed. Wrong password.'});
                } else {

                    // if user is found and password is right
                    // create a token with only our given payload
                    // we don't want to pass in the entire user since that has the password
                    const payload = {
                        _id: user._id
                    };
                    var token = jwt.sign(payload, config.secret, {
                        expiresIn: 60 * 60 * 24 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            });
        }

    });
});


router.use(requireAuthenticated);

// Users
router.get('/', (req,res,next) => {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

router.get('/me', (req, res) => {
    User.findOne({
        _id: req.decoded._id
    }, function (err, user) {
        res.json(user);
    });
});


// Update

router.put('/update', (req, res) => {
    if (req.body.telephone >= 100000000 && req.body.telephone<=999999999)
    {
        User.update({
            _id: req.decoded._id
        }, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                telephone: req.body.telephone
            }, function (err, user) {
                res.json(user);
            });
    }
    else{
        res.status(403).send({ success: false, message: 'Wrong phone number' });
    }   
});


// delete

router.post('/delete', (req, res) => {
    User.findOne({
        _id: req.decoded._id
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.status(403).send({ success: false, message: 'Delete account failed. User not found.' });
        } else if (user) {

            bcrypt.compare(req.body.password, user.password, function (err, match) {

                // check if password matches
                if (!match) {
                    res.status(403).send({ success: false, message: 'Delete account failed. Wrong password.'});
                } else {
                    User.remove({ _id: user._id }, function (err) {
                        if (!err) {
                            res.json({
                                success: true,
                                message: 'Account deleted'
                            });
                        }
                        else {
                            res.status(403).send({ success: false, message: 'Could not delete user' });
                        }
                    });
                    
                }
            });
        }
    });
});



module.exports = router;