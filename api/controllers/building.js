'use strict'
var Building = require('../models/building');
// var path             = require('path');
// var fs               = require('fs');
var moment           = require('moment');

function testbuilding(req, res){
	res.status(200).send({
		message: 'this is a building'
	});
}

function createBuilding(req, res){
	var params = req.body;
	var building = new Building();
	if (params.address){
		// If address doesnt exist, then create new record
		Building.findOne({'address': params.address}).exec((err, addressExists) => {
			if(!addressExists){
				var building                   = new Building();
				building.address               = params.address;
				building.apartment             = params.apartment;
				building.globalRate            = 0;
				building.globalNoise           = 0;
				building.globalPriceBenefit    = 0;
				building.globalLandlordSupport = 0;
				building.globalMaintenance     = 0;
				building.reviewsCounter        = 0;
				building.created_at            = moment().unix();
				building.save((err, buildingStored) => {
					if(err) return res.status(500).send({message: 'Error when creating building'});
					if(buildingStored){
						res.status(200).send({building: buildingStored});
					}else{
						res.status(404).send({message: 'Error when creating building. not saved'});
					}
				});
			}else{
				// Check for apartment as well, if it doesnt exist, then create record
				Building.findOne({'address': params.address, 'apartment': params.apartment}).exec((err, addressExists) => { 
					if(!addressExists){
						var building                   = new Building();
						building.address               = params.address;
						building.apartment             = params.apartment;
						building.globalRate            = 0;
						building.globalNoise           = 0;
						building.globalPriceBenefit    = 0;
						building.globalLandlordSupport = 0;
						building.globalMaintenance     = 0;
						building.reviewsCounter        = 0;
						building.created_at            = moment().unix();
						building.save((err, buildingStored) => {
							if(err) return res.status(500).send({message: 'Error when creating building - apartment'});
							if(buildingStored){
								res.status(200).send({building: buildingStored});
							}else{
								res.status(404).send({message: 'Error when creating building apt, not saved'});
							}
						});
					}else{
						return res.status(200).send({message: "Building already exists"});
					}
				});
			}
		});
	}
}

/*
function getCounters(req, res){
	var userId = req.user.sub;
	if(req.params.id){
		userId = req.params.id//;
	}

	getCountFollow(userId).then((value) =>{
		return res.status(200).send(value);
	});
}

async function getCountFollow(user_id){
	var pubications = await Publication.count({"user": userId}).exec((err, count) => {
		if(err) return handleError(err);
		return count;
	});

	return {
		publications: publications
	}
}*/




module.exports = {
	testbuilding,
	createBuilding
}