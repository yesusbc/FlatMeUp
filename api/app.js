'use strict'

var express    = require('express');
var bodyParser = require("body-parser");

var app = express();

// Load Routes
var user_routes        = require('./routes/user');
var publication_routes = require('./routes/publication');
var building_routes    = require('./routes/building');
var message_routes     = require('./routes/message');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// cors
// configure http headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});


// Routes
app.use('/api', user_routes);
app.use('/api', publication_routes);
app.use('/api', building_routes);
app.use('/api', message_routes);


// Export
module.exports = app;