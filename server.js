var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var path = require('path');

const argv = require('yargs').argv;

var configFile = argv.config ? './config.' + argv.config : './config';
var config = require(configFile); // get our config file
console.log("\nCONFIG FILE:", configFile, '\n\n');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection(config.database);
autoIncrement.initialize(connection);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use morgan to log requests to the console
app.use(morgan('dev'));

const users = require('./routes/users');
app.use('/api/users', users);

const products = require('./routes/products');
app.use('/api/products', products);

const orders = require('./routes/orders');
app.use('/api/orders', orders);

const messages = require('./routes/messages');
app.use('/api/messages', messages);

const comments = require('./routes/comments');
app.use('/api/comments', comments);

const reviews = require('./routes/reviews');
app.use('/api/reviews', reviews);

// upload files serves as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Send all other requests to the Angular app
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);