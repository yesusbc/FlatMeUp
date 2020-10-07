'use strict'
const Building     = require('../models/building');
const Publication  = require('../models/publication');
const moment       = require('moment');
const { ObjectId } = require('mongodb');

function testbuilding(req, res){
	res.status(200).send({
		message: 'this is the building route'
	});
}

// Function to create building, may need rework
// Maybe it needs to be params.adddss.xxx
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
						return res.status(200).send({message: 'Building already exists'});
					}
				});
			}
		});
	}else{
		return res.status(500).send({message: 'Missing address information'});
	}
}

// Function to get Building by buildingId
// Args: buildingId
// Returns Building model
function getBuildingById(req, res){
	var buildingId = req.params.buildingId;
	Building.findOne({'_id': buildingId}).exec((err, buildingExists) => {
		if (err) return res.status(500).send({message: 'Error when returning building'});
		if(buildingExists){

			// Get review counter
			Publication.count({'buildingId': buildingId}).exec((err, reviewsCounter) => {

				// Get stats
				Publication.aggregate([
	    			{ '$match':{ 'buildingId': ObjectId(buildingId) } },
	        		{'$group': {
	        			 		'_id': null,
	            				'globalRate': { '$avg': '$rate' },
	            				'globalNoise': { '$avg': '$noise' },
	            				'globalPriceBenefit': { '$avg': '$pricebenefit' },
	            				'globalLandlordSupport': { '$avg': '$landlordSupport' },
	            				'globalMaintenance': { '$avg': '$maintenance' }
	        					}
	        				}
				], function(err, results){
	    			if (err) console.log ('record not found');
	    			else {
	    				var globalRate = '--';
	    				var globalNoise = '--';
	    				var globalPriceBenefit = '--';
	    				var globalLandlordSupport = '--';
	    				var globalMaintenance = '--';
	    				if (results[0]){
		    				globalRate = results[0]['globalRate'];
	    					globalNoise = results[0]['globalNoise'];
	    					globalPriceBenefit = results[0]['globalPriceBenefit'];
	    					globalLandlordSupport = results[0]['globalLandlordSupport'];
	    					globalMaintenance = results[0]['globalMaintenance'];
	    					}
	    				res.status(200).send({
	    					building: buildingExists, 
	    					globalRate,
	    					globalNoise,
	    					globalPriceBenefit,
	    					globalLandlordSupport,
	    					globalMaintenance,
	    					reviewsCounter});
	    				}     
					});
			});
			
		}else{
			res.status(404).send({message: 'Building doesnt exists'});
		}
	});
}

// Function to get Buildings
// Args: Optional: Page (1)
// Returns Buildings Json
function getBuildings(req, res){
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;
	Building.find({}).select('address apartment globalRate file reviewsCounter created_at').paginate(page, itemsPerPage, (err, buildings, totalBuildings) => {	
		if (err) return res.status(500).send({message: 'Error when returning buildings'});
		return res.status(200).send({
			total: totalBuildings,
			pages: Math.ceil(totalBuildings/itemsPerPage),
			buildings
		});

	});
}

// Function to get Buildings by Address
// Args: Required: Address query.    Optional: Page (1)
// Returns Buildings Json
function getBuildingsByAddress(req, res){
	var page  = 1;
	var params = req.body;

	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage    = 4;
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

	Building.find(queryFilter).sort('-created_at').select('_id address globalRate reviewsCounter file created_at').paginate(page, itemsPerPage, (err, buildings, totalBuildings) => {	
		if(err) return res.status(500).send({message: 'Error in buildings request'});
		if(!buildings) return res.status(404).send({message: 'No buildings with those filters'});
		return res.status(200).send({
			total: totalBuildings,
			pages: Math.ceil(totalBuildings/itemsPerPage),
			buildings
		});
	});
}

// Function to upload image(s) to building 
// Args: Images
// Returns -
function uploadImage(req, res){
	var buildingId = req.params.buildingId;
	var filenames_list = [];

	if(req.files){
		if(req.files.image.length){
			for (var idx=0; idx < req.files.image.length; idx++){
				var file_path = req.files.image[idx].path;
		    	var file_split = file_path.split('/');
				var file_name  = file_split[2];
				var ext_split  = file_name.split('.');
				var file_ext   = ext_split[1];
				if (file_ext=='png' || file_ext=='jpg' || file_ext=='jpeg'){
					filenames_list.push(file_name);
				}else{
					return removeFilesOfUploads(res, file_path, 'Extension not valid');
				}
			}
		}else{
			var file_path  = req.files.image.path;
			var file_split = file_path.split('/');
			var file_name  = file_split[2];
			var ext_split  = file_name.split('.');
			var file_ext   = ext_split[1];
			if (file_ext=='png' || file_ext=='jpg' || file_ext=='jpeg'){
				filenames_list.push(file_name);
			}else{
				return removeFilesOfUploads(res, file_path, 'Extension not valid');
			}
		}

		Building.findByIdAndUpdate(buildingId, {$push: {file: filenames_list}}, {new: true}, (err, buildingUpdated) =>{
					if(err) return res.status(500).send({message: 'Error in request'});
					if(!buildingUpdated) return res.status(404).send({message: 'Couldnot upload image'});
					return res.status(200).send({building: buildingUpdated});
				});
	}else{
		return res.status(200).send({message: 'Image was not uploaded'});
	}
}

module.exports = {
	testbuilding,
	createBuilding,
	getBuildings,
	getBuildingById,
	getBuildingsByAddress,
	uploadImage
}