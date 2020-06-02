let mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let userSchema = mongoose.Schema({

    user_id: String,
    user_name: String,
    user_email: String

});

let User = mongoose.model("User", userSchema);

let userList = {
    
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

module.exports = { UserList };