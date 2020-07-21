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


/*
mongoose.Promise = global.Promise;

let userSchema = mongoose.Schema({

    user_id: String,
    user_name: String,
    user_email: String

});

let User = mongoose.model("User", userSchema);

let UserList = {
    
    get_all : function() {
        return User.find()
            .then( users => {
                return users;
            })
            .catch( error => {
                throw Error(error);
            });
    },

    get_by_id : function() {
        return User.findOne({ user_id : user_id })
            .then( user => {
                return user;
            })
            .catch( error => {
                throw Error(error);
            })
    },

    post_new : function() {
        return User.create(user)
            .then( user => {
                return user;
            })
            .catch( error => {
                throw Error(error);
            })
    },

    login : function() {
        return User.findOne({ user_id : user_id })
            .then( user => {
                return user;
            })
            .catch( error => {
                throw Error(error);
            });
    }

};

module.exports = { UserList };*/