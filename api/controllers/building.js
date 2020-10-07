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

}

// Function to get Building by buildingId
// Args: buildingId
// Returns Building model
function getBuildingById(req, res){
	const buildingId = req.params.buildingId;
	Building.findOne({'_id': buildingId}).exec((err, buildingExists) => {
		if (err) return res.status(500).send({message: 'Error when returning building'});
		if(buildingExists){

			// Get review counter
			Publication.count({'buildingId': buildingId}).exec((err, reviewsCounter) => {

				// Get stats
				Publication.aggregate([
	    			{ '$match': { 'buildingId': ObjectId(buildingId) } },
	        		{ '$group': {
	        			 		'_id': null,
	            				'globalRate': { '$avg': '$rate' },
	            				'globalNoise': { '$avg': '$noise' },
	            				'globalPriceBenefit': { '$avg': '$pricebenefit' },
	            				'globalLandlordSupport': { '$avg': '$landlordSupport' },
	            				'globalMaintenance': { '$avg': '$maintenance' }
	        					}
	        				}
				], function(err, results){
	    			if (err) { console.log ('record not found'); }
	    			else {
	    				let globalRate = results[0] ? results[0]['globalRate'] : '--';
	    				let globalNoise = results[0] ? results[0]['globalNoise'] : '--';
	    				let globalPriceBenefit = results[0] ? results[0]['globalPriceBenefit'] : '--';
	    				let globalLandlordSupport = results[0] ? results[0]['globalLandlordSupport'] : '--';
	    				let globalMaintenance = results[0] ? results[0]['globalMaintenance'] : '--';
	    				
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
	const page = req.params.page ? req.params.page : 1;
	const itemsPerPage = 4;

	Building.find({}).select('address apartment globalRate file reviewsCounter created_at').paginate(page, itemsPerPage, (err, buildings, totalBuildings) => {	
		if (err) return res.status(500).send({ message: 'Error when returning buildings' });
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
	const params = req.body;
	const page = req.params.page ? req.params.page : 1;
	
	const itemsPerPage = 4;
	const country = params.address.country ? params.address.country : undefined;
	const state = params.address.state ? params.address.state : undefined;
	const city = params.address.city ? params.address.city : undefined;
	const street = params.address.street ? params.address.street : undefined;
	const buildingNumber = params.address.buildingNumber ? params.address.buildingNumber: undefined;
	const apartment = params.address.apartment ? params.address.apartment : undefined;
	const zip = params.address.zip ? params.address.zip : undefined;

	let queryFilter = {
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
	const buildingId = req.params.buildingId;
	let filenames_list = [];

	if(req.files){
		if(req.files.image.length){
			for (let idx=0; idx < req.files.image.length; idx++){
				let file_path = req.files.image[idx].path;
		    	let file_split = file_path.split('/');
				let file_name  = file_split[2];
				let ext_split  = file_name.split('.');
				let file_ext   = ext_split[1];
				if (file_ext=='png' || file_ext=='jpg' || file_ext=='jpeg'){
					filenames_list.push(file_name);
				}else{
					return removeFilesOfUploads(res, file_path, 'Extension not valid');
				}
			}
		}else{
			let file_path  = req.files.image.path;
			let file_split = file_path.split('/');
			let file_name  = file_split[2];
			let ext_split  = file_name.split('.');
			let file_ext   = ext_split[1];
			if (file_ext=='png' || file_ext=='jpg' || file_ext=='jpeg'){
				filenames_list.push(file_name);
			}else{
				return removeFilesOfUploads(res, file_path, 'Extension not valid');
			}
		}

		Building.findByIdAndUpdate(buildingId, { $push: { file: filenames_list } }, { new: true }, (err, buildingUpdated) => {
					if(err) return res.status(500).send({message: 'Error in request'});
					if(!buildingUpdated) return res.status(404).send({message: 'Couldnot upload image'});
					return res.status(200).send({building: buildingUpdated});
				});
	} else {
		return res.status(200).send({ message: 'Image was not uploaded' });
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