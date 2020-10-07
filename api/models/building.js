'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BuildingSchema = Schema({
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
	file: [{
        type: String
    }],
	created_at: String,
	globalRate: Number,
	reviewsCounter: Number,	
});

module.exports = mongoose.model('Building', BuildingSchema);