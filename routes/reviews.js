const express = require('express');
const router = express.Router();

var Review = require('../models/review');

var config = require('../config');
var requireAuthenticated = require('../require-authenticated');

// Get all reviews
router.get('/', (req, res, next) => {
    Review.find({}, function (err, reviews) {
        res.json(reviews);
    });
});

// Get all reviews by user
router.get('/user:id', (req, res, next) => {
    Review.find({ _userId: req.params.id }, function (err, reviews) {
        res.json(reviews);
    });
});

// Get all reviews of a product
router.get('/product:id', (req, res, next) => {
    Review.find({ _productId: req.params.id }, function (err, reviews) {
        res.json(reviews);
    });
});

// Get a message by id
router.get('/:id', (req, res, next) => {
    Review.find({ _id: req.params.id }, function (err, message) {
        res.json(message);
    });
});

router.use(requireAuthenticated);

// Create
router.post('/', (req, res, next) => {
    let newReview = new Review({
        _userId: req.body._userId,
        userFirstName: req.body.userFirstName,
        userLastName: req.body.userLastName,
        _productId: req.body._productId,
        rating: req.body.rating,
        review: req.body.review,
        title: req.body.title,
        dateYear: req.body.dateYear,
        dateMonth: req.body.dateMonth,
        dateDay: req.body.dateDay,
    });
    Review.createReview(newReview, (err, reviews) => {
        if (err) {
            res.status(403).json({ success: false, msg: err });
        }
        else {
            res.json(reviews);
        }
    });
});

// Update
router.put('/update/:id', (req, res, next) => {

    Review.update({ _id: req.params.id }, {
        _userId: req.body._userId,
        userFirstName: req.body.userFirstName,
        userLastName: req.body.userLastName,
        _productId: req.body._productId,
        rating: req.body.rating,
        review: req.body.review,
        title: req.body.title,
        dateYear: req.body.dateYear,
        dateMonth: req.body.dateMonth,
        dateDay: req.body.dateDay,
    }, (err, review) => {
        if (err) {
            res.status(403).json({ success: false, msg: err });
        }
        else {
            res.json(review);
        }
    });
});


// Delete

router.post('/delete', (req, res) => {
    Review.remove({ _id: req.body._id }, function (err) {
        if (!err) {
            res.json({
                success: true,
                message: 'Review deleted'
            });
        }
        else {
            res.status(403).send({ success: false, message: 'Could not delete review' });
        }
    });
});


module.exports = router;