'use strict'

var mongoose = require('mongoose')
var app = require('./app')
var PORT = 3800;

// Database connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/FlatMeUp', {useMongoClient : true})
        .then(() =>{
            console.log("Database connection successfully...");

            // Create server
            app.listen(PORT, () => {
                console.log("Server running at http://localhost:3800");
            });

        })
        .catch(err => console.log(err));
