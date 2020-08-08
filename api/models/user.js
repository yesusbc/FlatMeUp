'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
		name: String,
		userName: String,
		email: String,
		password: String,
		contributionsNumber: Number,
		gender: Number,
		occupation: String,
		country: String,
		state: String,
		city: String,
		birthday: Date
});

module.exports = mongoose.model('User', UserSchema);