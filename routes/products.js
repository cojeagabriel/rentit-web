const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const util = require('util');

var Product = require('../models/product');
var Image = require('../models/image');

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


// Upload file
router.post('/:id/images', (req, res) => {
    // const form = new formidable.IncomingForm();

    // form.uploadDir = 'uploads';
    // form.keepExtensions = true;

    Product.findOne({ _id: req.params.id }, (err, product) => {
        console.log("product", product);
        product.images.push({
            fileName: 'test',
            mimeType: 'image/gif',
            size: 123
        });
        console.log("product before save", product);
        product.save(((err) => {
            if (err) {
                res.status(403).json({ success: false, msg: err });
            }
            else {
                res.status(200).json({ success: true });
            }
        }))
    });


    // Image.createImage(newImage, (err, image) => {
    //     if (err) {
    //         res.status(403).json({ success: false, msg: err });
    //     }
    //     else {
    //         console.log("image", image);
    //         Product.findOne({ _id: req.params.id }, (err, product) => {
    //             console.log("product", product);
    //             product.images.push({
    //                 fileName: 'test',
    //                 mimeType: 'image/gif',
    //                 size: 123
    //             });
    //             console.log("product before save", product);
    //             product.save(((err) => {
    //                 res.status(200).json({ success: true });
    //             }))
    //         });
    //     }
    // });



    // form.parse(req, (err, fields, files) => {
    //     if (err) {
    //         res.status(403).json({ success: false, msg: err });
    //     } else {
    //         res.writeHead(200, { 'content-type': 'text/plain' });
    //         res.write('received upload:\n\n');
    //         res.end(util.inspect({ fields: fields, files: files }));

    //         Product.update({ _id: req.params.id }, {
    //             title: req.body.title,
    //             _ownerId: req.body._ownerId,
    //             category: req.body.category,
    //             description: req.body.description,
    //             quantity: req.body.quantity,
    //             available: req.body.available,
    //             price: req.body.price,
    //             pricePer: req.body.pricePer
    //         }, (err, product) => {
    //             if (err) {
    //                 res.status(403).json({ success: false, msg: err });
    //             }
    //             else {
    //                 res.json(product);
    //             }
    //         });
    //     }
    // });
    // Product.remove({ _id: req.body._id }, function (err) {
    //     if (!err) {
    //         res.json({
    //             success: true,
    //             message: 'Product deleted'
    //         });
    //     }
    //     else {
    //         res.status(403).send({ success: false, message: 'Could not delete product' });
    //     }
    // });
    // res.status(403).json({ success: false });
});

router.use(requireAuthenticated);

// Create
router.post('/', (req, res, next) => {
    let newProduct = new Product({
        title: req.body.title,
        _ownerId: req.body._ownerId,
        category: req.body.category,
        description: req.body.description,
        quantity: req.body.quantity,
        available: req.body.available,
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
        quantity: req.body.quantity,
        available: req.body.available,
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


// Delete

router.post('/delete', (req, res) => {
    Product.remove({ _id: req.body._id }, function (err) {
        if (!err) {
            res.json({
                success: true,
                message: 'Product deleted'
            });
        }
        else {
            res.status(403).send({ success: false, message: 'Could not delete product' });
        }
    });
});

module.exports = router;