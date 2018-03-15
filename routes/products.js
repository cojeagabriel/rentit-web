const express = require('express');
const router = express.Router();

var Product = require('../models/product');

var config = require('../config');
var requireAuthenticated = require('../require-authenticated');

// Get all products
router.get('/', (req, res, next) => {
    Product.find({}, function (err, products) {
        res.json(products);
    });
});

// Get all products of an user
router.get('/owner:id', (req, res, next) => {
    Product.find({_ownerId: req.params.id}, function (err, products) {
        res.json(products);
    });
});

// Get a product by id
router.get('/:id', (req, res, next) => {
    Product.find({ _id: req.params.id}, function (err, product) {
        res.json(product);
    });
});

router.use(requireAuthenticated);

// Create
router.post('/', (req, res, next) => {
    let newProduct = new Product({
        title: req.body.title,
        _ownerId: req.body._ownerId,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        pricePer: req.body.pricePer
    });
    Product.createProduct(newProduct, (err, product) => {
        if (err) {
            res.status(403).json({ success: false, msg: err });
        }
        else {
            res.json(product);
        }
    });
});

// Update
router.put('/update/:id', (req, res, next) => {

    Product.update({_id: req.params.id}, {
        title: req.body.title,
        _ownerId: req.body._ownerId,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        pricePer: req.body.pricePer
    }, (err, product) => {
        if (err) {
            res.status(403).json({ success: false, msg: err });
        }
        else {
            res.json(product);
        }
    });
});


module.exports = router;