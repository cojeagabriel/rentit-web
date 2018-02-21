const express = require('express');
const router = express.Router();

var Product = require('../models/product');

var config = require('../config');
var requireAuthenticated = require('../require-authenticated');

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


// Get all products
router.get('/', (req, res, next) => {
    Product.find({}, function (err, products) {
        res.json(products);
    });
});

module.exports = router;