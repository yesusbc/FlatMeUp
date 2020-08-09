'use strict'

var express = require('express');
var bodyParser = require("body-parser");

var app = express();

// Load Routes
var user_routes = require('./routes/user');
var publication_routes = require('./routes/publication');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// cors


// Routes
app.use('/api', user_routes);
app.use('/api', publication_routes);



// Export
module.exports = app;