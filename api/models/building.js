'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BuildingSchema = Schema({
	// address: String,
	address: {
		country: String,
        state: String,
        city: String,
        street: String,
        buildingNumber: Number,
        apartment: String,
        zip: Number
    },
	file: [{
        type: String
    }],
	created_at: String,
	globalRate: Number,
	globalNoise: Number,
	globalPriceBenefit: Number,
	globalLandlordSupport: Number,
	globalMaintenance: Number,
	reviewsCounter: Number,	
});

module.exports = mongoose.model('Building', BuildingSchema);