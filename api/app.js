'use strict'

var express = require('express');
var bodyParser = require("body-parser");

var app = express();

// Load Routes
var user_routes = require('./routes/user');


// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// cors


// Routes
app.use('/api', user_routes);



// Export
module.exports = app;