'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BuildingSchema = Schema({
	address: String,
	apartment: String,
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