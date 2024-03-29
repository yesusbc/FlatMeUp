'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema({
	text: String,
	viewed: Number,
	created_at: String,
	address: String,
	emitter: {type: Schema.ObjectId, ref:'User'},
	receiver: {type: Schema.ObjectId, ref:'User'}
});

module.exports = mongoose.model('Message', MessageSchema);