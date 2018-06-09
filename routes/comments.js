const express = require('express');
const router = express.Router();

var Comment = require('../models/comment');

var config = require('../config');
var requireAuthenticated = require('../require-authenticated');

// Get all comments
router.get('/', (req, res, next) => {
    Comment.find({}, function (err, comments) {
        res.json(comments);
    });
});

// Get all comments by sender
router.get('/sender:id', (req, res, next) => {
    Comment.find({ _senderId: req.params.id }, function (err, comments) {
        res.json(comments);
    });
});

// Get all comments of a product
router.get('/product:id', (req, res, next) => {
    Comment.find({ _productId: req.params.id }, function (err, comments) {
        res.json(comments);
    });
});

// Get a comment by id
router.get('/:id', (req, res, next) => {
    Comment.find({ _id: req.params.id }, function (err, comment) {
        res.json(comment);
    });
});

router.use(requireAuthenticated);

// Create
router.post('/', (req, res, next) => {
    let newComment = new Comment({
        _senderId: req.body._senderId,
        senderFirstName: req.body.senderFirstName,
        senderLastName: req.body.senderLastName,
        _productId: req.body._productId,
        comment: req.body.comment,
        dateYear: req.body.dateYear,
        dateMonth: req.body.dateMonth,
        dateDay: req.body.dateDay,
    });
    Comment.createComment(newComment, (err, comments) => {
        if (err) {
            res.status(403).json({ success: false, msg: err });
        }
        else {
            res.json(comments);
        }
    });
});

// Update
router.put('/update/:id', (req, res, next) => {

    Comment.update({ _id: req.params.id }, {
        _senderId: req.body._senderId,
        senderFirstName: req.body.senderFirstName,
        senderLastName: req.body.senderLastName,
        _productId: req.body._productId,
        comment: req.body.comment,
        dateYear: req.body.dateYear,
        dateMonth: req.body.dateMonth,
        dateDay: req.body.dateDay,
    }, (err, comment) => {
        if (err) {
            res.status(403).json({ success: false, msg: err });
        }
        else {
            res.json(comment);
        }
    });
});


// Delete

router.post('/delete', (req, res) => {
    Comment.remove({ _id: req.body._id }, function (err) {
        if (!err) {
            res.json({
                success: true,
                message: 'Comment deleted'
            });
        }
        else {
            res.status(403).send({ success: false, message: 'Could not delete comment' });
        }
    });
});


module.exports = router;