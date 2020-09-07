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
	if (params.address.country && params.address.state && params.address.city && params.address.street && params.address.buildingNumber && params.zip){
		// If address doesnt exist, then create new record
		Building.findOne({'address.country'        : params.address.country,
						  'address.state'          : params.address.state,
						  'address.city'           : params.address.city,
						  'address.street'         : params.address.street,
						  'address.buildingNumber' : params.address.buildingNumber,
						  'address.zip'            : params.address.zip}).exec((err, addressExists) => {
			if(!addressExists){
				var building                    = new Building();
				building.address.country        = params.address.country;
				building.address.state          = params.address.state;
				building.address.city           = params.address.city;
				building.address.street         = params.address.street;
				building.address.buildingNumber = params.address.buildingNumber;
				building.address.zip            = params.address.zip;
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
				Building.findOne({'address.apartment'      : params.address.apartment,
								  'address.country'        : params.address.country,
						  		  'address.state'          : params.address.state,
						  		  'address.city'           : params.address.city,
						  		  'address.street'         : params.address.street,
						  		  'address.buildingNumber' : params.address.buildingNumber,
						  		  'address.zip'            : params.address.zip}).exec((err, addressExists) => { 
					if(!addressExists){
						var building                   = new Building();
						building.address.country        = params.address.country;
						building.address.state          = params.address.state;
						building.address.city           = params.address.city;
						building.address.street         = params.address.street;
						building.address.buildingNumber = params.address.buildingNumber;
						building.address.zip            = params.address.zip;
						building.address.apartment      = params.address.apartment;
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
	var country         = params.address.country        ? params.address.country       : undefined;
	var state           = params.address.state          ? params.address.state         : undefined;
	var city            = params.address.city           ? params.address.city          : undefined;
	var street          = params.address.street         ? params.address.street        : undefined;
	var buildingNumber  = params.address.buildingNumber ? params.address.buildingNumber: undefined;
	var apartment       = params.address.apartment      ? params.address.apartment     : undefined;
	var zip             = params.address.zip            ? params.address.zip           : undefined;

	var queryFilter = {
    	'address.country':        country,
    	'address.state':          state,
    	'address.city':           city,
    	'address.street':         street,
    	'address.buildingNumber': buildingNumber,
    	'address.apartment':      apartment,
    	'address.zip':            zip
	}
	// Remove undefined elements from query
	Object.keys(queryFilter).forEach(key => queryFilter[key] === undefined && delete queryFilter[key])

	Building.find(queryFilter).sort('-created_at').select('address globalRate reviewsCounter').paginate(page, itemsPerPage, (err, buildings, totalBuildings) => {	
		if(err) return res.status(500).send({message: 'Error in buildings request'});
		if(!buildings) return res.status(404).send({message: 'No buildings with those filters'});
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