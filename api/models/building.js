'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BuildingSchema = Schema({
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
	globalNoise: Number,
	globalPriceBenefit: Number,
	globalLandlordSupport: Number,
	globalMaintenance: Number,
	reviewsCounter: Number,	
});

module.exports = mongoose.model('Building', BuildingSchema);