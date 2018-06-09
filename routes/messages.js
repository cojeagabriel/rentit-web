const express = require('express');
const router = express.Router();

var Message = require('../models/message');

var config = require('../config');
var requireAuthenticated = require('../require-authenticated');

// Get all messages
router.get('/', (req, res, next) => {
    Message.find({}, function (err, messages) {
        res.json(messages);
    });
});

// Get all messages by sender
router.get('/sender:id', (req, res, next) => {
    Message.find({ _senderId: req.params.id }, function (err, messages) {
        res.json(messages);
    });
});

// Get all messages by reciever
router.get('/reciever:id', (req, res, next) => {
    Message.find({ _recieverId: req.params.id }, function (err, messages) {
        res.json(messages);
    });
});

// Get a message by id
router.get('/:id', (req, res, next) => {
    Message.find({ _id: req.params.id }, function (err, message) {
        res.json(message);
    });
});

router.use(requireAuthenticated);

// Create
router.post('/', (req, res, next) => {
    let newMessage = new Message({
        _senderId: req.body._senderId,
        _recieverId: req.body._recieverId,
        title: req.body.title,
        content: req.body.content,
        dateYear: req.body.dateYear,
        dateMonth: req.body.dateMonth,
        dateDay: req.body.dateDay,
        dateHour: req.body.dateHour,
        dateMinute: req.body.dateMinute,
    });
    Message.createMessage(newMessage, (err, message) => {
        if (err) {
            res.status(403).json({ success: false, msg: err });
        }
        else {
            res.json(message);
        }
    });
});

// Update
router.put('/update/:id', (req, res, next) => {

    Message.update({ _id: req.params.id }, {
        _senderId: req.body._senderId,
        _recieverId: req.body._recieverId,
        title: req.body.title,
        content: req.body.content,
        dateYear: req.body.dateYear,
        dateMonth: req.body.dateMonth,
        dateDay: req.body.dateDay,
        dateHour: req.body.dateHour,
        dateMinute: req.body.dateMinute,
    }, (err, message) => {
        if (err) {
            res.status(403).json({ success: false, msg: err });
        }
        else {
            res.json(message);
        }
    });
});


// Delete

router.post('/delete', (req, res) => {
    Message.remove({ _id: req.body._id }, function (err) {
        if (!err) {
            res.json({
                success: true,
                message: 'Message deleted'
            });
        }
        else {
            res.status(403).send({ success: false, message: 'Could not delete message' });
        }
    });
});


module.exports = router;