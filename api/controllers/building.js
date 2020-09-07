'use strict'
const Building         = require('../models/building');
const moment           = require('moment');

function testbuilding(req, res){
	res.status(200).send({
		message: 'this is a building'
	});
}

// Maybe it needs to be params.address.xxx
function createBuilding(req, res){
	var params = req.body;
	var building = new Building();
	if (params.country && params.state && params.city && params.street && params.buildingNumber && params.zip){
		// If address doesnt exist, then create new record
		Building.findOne({'address.country'        : params.country,
						  'address.state'          : params.state,
						  'address.city'           : params.city,
						  'address.street'         : params.street,
						  'address.buildingNumber' : params.buildingNumber,
						  'address.zip'            : params.zip}).exec((err, addressExists) => {
			if(!addressExists){
				var building                    = new Building();
				building.address.country        = params.country;
				building.address.state          = params.state;
				building.address.city           = params.city;
				building.address.street         = params.street;
				building.address.buildingNumber = params.buildingNumber;
				building.address.zip            = params.zip;
				building.address.apartment     = params.apartment ? params.apartment : null;
				building.typeOfBuilding         = 0;
				building.globalRate             = 0;
				building.globalNoise            = 0;
				building.globalPriceBenefit     = 0;
				building.globalLandlordSupport  = 0;
				building.globalMaintenance      = 0;
				building.reviewsCounter         = 0;
				building.created_at             = moment().unix();
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
				Building.findOne({'address.apartment'      : params.apartment,
								  'address.country'        : params.country,
						  		  'address.state'          : params.state,
						  		  'address.city'           : params.city,
						  		  'address.street'         : params.street,
						  		  'address.buildingNumber' : params.buildingNumber,
						  		  'address.zip'            : params.zip}).exec((err, addressExists) => { 
					if(!addressExists){
						var building                   = new Building();
						building.address.country        = params.country;
						building.address.state          = params.state;
						building.address.city           = params.city;
						building.address.street         = params.street;
						building.address.buildingNumber = params.buildingNumber;
						building.address.zip            = params.zip;
						building.address.apartment      = params.apartment;
						building.typeOfBuilding         = 0;
						building.globalRate             = 0;
						building.globalNoise            = 0;
						building.globalPriceBenefit     = 0;
						building.globalLandlordSupport  = 0;
						building.globalMaintenance      = 0;
						building.reviewsCounter         = 0;
						building.created_at             = moment().unix();
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
	}else{
		return res.status(500).send({message: 'Missing address information'});
	}
}

function getBuildingById(req, res){
	var buildingId = req.params.buildingId;

	Building.findOne({'_id': buildingId}).exec((err, buildingExists) => {
		if (err) return res.status(500).send({message: 'Error when returning building'});
		if(buildingExists){
			res.status(200).send({building: buildingExists});
		}else{
			res.status(404).send({message: "Building doesnt exists"});
		}
	});
}

function getBuildings(req, res){
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 8;

	Building.find({}).select('address apartment globalRate file reviewsCounter').paginate(page, itemsPerPage, (err, buildings, totalBuildings) => {	
		if (err) return res.status(500).send({message: 'Error when returning buildings'});

		return res.status(200).send({
			total: totalBuildings,
			pages: Math.ceil(totalBuildings/itemsPerPage),
			buildings
		});

	});
}

// .sort created at
function getBuildingsByAddress(req, res){
	var page  = 1;
	var params = req.body;

	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage    = 6;
	var country         = params.country        ? params.country       : undefined;
	var state           = params.state          ? params.state         : undefined;
	var city            = params.city           ? params.city          : undefined;
	var street          = params.street         ? params.street        : undefined;
	var buildingNumber  = params.buildingNumber ? params.buildingNumber: undefined;
	var apartment       = params.apartment      ? params.apartment     : undefined;
	var zip             = params.zip            ? params.zip           : undefined;

	var queryFilter = {
    	'address.country':        country,
    	'address.state':          state,
    	'address.city':           city,
    	'address.street':         street,
    	'address.buildingNumber': buildingNumber,
    	'address.apartment':      apartment,
    	'address.zip':            zip
	}
	// Remove undefined
	Object.keys(queryFilter).forEach(key => queryFilter[key] === undefined && delete queryFilter[key])

	Building.find(queryFilter).sort('-created_at').select('address globalRate reviewsCounter').paginate(page, itemsPerPage, (err, buildings, totalBuildings) => {	
		if(err) return res.status(500).send({message: 'Error in buildings request'});
		if(!buildings) return res.status(404).send({message: 'No buildings with those filters'});
		console.log(buildings);
		return res.status(200).send({
			total: totalBuildings,
			pages: Math.ceil(totalBuildings/itemsPerPage),
			buildings
		});
	});
}


/*
function getGlobalCounters(req, res){
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
}
*/



module.exports = {
	testbuilding,
	createBuilding,
	getBuildings,
	getBuildingById,
	getBuildingsByAddress
}