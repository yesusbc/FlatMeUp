'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicationSchema = Schema({
		address: String,
		rate: [Number],
		// ruido, seguridad, precio beneficio, rentero, conservacion/limpieza, upvotedownvote, me interesa?
		text: String,
		file: String,
		created_at: String,
		vote: [Number],
		user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Publication', PublicationSchema);