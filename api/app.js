'use strict'

const express    = require('express');
const bodyParser = require('body-parser');

const app = express();

// Load Routes
const user_routes        = require('./routes/user');
const publication_routes = require('./routes/publication');
const building_routes    = require('./routes/building');
const message_routes     = require('./routes/message');

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