'use strict'

var express    = require('express');
const path = require('path');
var bodyParser = require("body-parser");
const mongoose = require('mongoose')

var app = express();

// Load Routes
var user_routes        = require('./routes/user');
var publication_routes = require('./routes/publication');
var building_routes    = require('./routes/building');
var message_routes     = require('./routes/message');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/public/";
app.use(express.static(distDir));

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

app.set('port', (process.env.PORT || 5000));

mongoose.Promise = global.Promise;

const uri = "mongodb+srv://admin:contraseña@cluster0.fp9nw.gcp.mongodb.net/FlatMeUp_development_DB?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
        .then(() =>{
            console.log("Database connection successfully...");

            var server = app.listen(app.get('port'), function () {
    			var port = server.address().port;
    			console.log("App now running on port", port);

        	});
        })
        .catch(err => console.log(err));

// Export
module.exports = app;
