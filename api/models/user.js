'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
		role: String,
		name: String,
		lastname: String,
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