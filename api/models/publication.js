'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicationSchema = Schema({
	user: { type: Schema.ObjectId, ref: 'User' },
	buildingId: { type: Schema.ObjectId, ref: 'Building' },
	address: {
		country: String,
        state: String,
        city: String,
        street: String,
        buildingNumber: String,
        apartment: String,
        zip: String
    },
    typeOfBuilding: Number,
	text: String,
	file: [{
        type: String
    }],
	created_at: String,
	rate: Number,
	noise: Number,
	priceBenefit: Number,
	landlordSupport: Number,
	maintenance: Number,
	votesCounter: Number,
	canBeContacted: Number,
	interactionWithBuilding: Number,
	timeOfInteraction: Number,	
});

module.exports = mongoose.model('Publication', PublicationSchema);