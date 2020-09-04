'use strict'

var path             = require('path');
var fs               = require('fs');
var moment           = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var Building = require('../models/building');
var User        = require('../models/user');

function probando(req, res){
	res.status(200).send({
		message: 'Hi from PUBLICATIONS CONTROLLER'
	});
}

function savePublication(req, res){
	var params = req.body;
	if(!params.address.street || !params.text){
		return res.status(200).send({
			message: 'Either address or text is missing'
		});
	}
	var publication = new Publication();

	publication.user       = req.user.sub;
	publication.text       = params.text;
	publication.file       = 'null';
	publication.created_at = moment().unix();
	publication.address.country         = params.address.country         ? params.address.country                 : null;
	publication.address.state           = params.address.state           ? params.address.state                   : null;
	publication.address.city            = params.address.city            ? params.address.city                    : null;
	publication.address.street          = params.address.street          ? params.address.street                  : null;
	publication.address.buildingNumber  = params.address.buildingNumber  ? params.address.buildingNumber          : null;
	publication.address.apartment       = params.address.apartment       ? params.address.apartment               : null;
	publication.address.zip             = params.address.zip             ? params.address.zip                     : null;
	publication.typeOfBuilding          = params.typeOfBuilding          ? params.typeOfBuilding          : null;
	publication.rate                    = params.rate                    ? params.rate                    : null;
	publication.noise                   = params.noise                   ? params.noise                   : null;
	publication.priceBenefit            = params.priceBenefit            ? params.priceBenefit            : null;
	publication.landlordSupport         = params.landlordSupport         ? params.landlordSupport         : null;
	publication.maintenance             = params.maintenance             ? params.gender                  : null;
	publication.votesCounter            = params.votesCounter            ? params.votesCounter            : 0;
	publication.canBeContacted          = params.canBeContacted          ? params.canBeContacted          : 1;
	publication.interactionWithBuilding = params.interactionWithBuilding ? params.interactionWithBuilding : null;
	publication.timeOfInteraction       = params.timeOfInteraction       ? params.timeOfInteraction       : null;

	publication.save((err, publicationStored) =>{
		if(err) return res.status(500).send({message: 'Error when saving publication'});
		if(!publicationStored) return res.status(404).send({message: 'Publication not saved'});
		// Contributions number + 1
		User.findOne({'_id':publication.user}).exec((err, userInf) => {
			var contributionsNumber = userInf.contributionsNumber;
			console.log(contributionsNumber);
			console.log(userInf.contributionsNumber);
			User.findByIdAndUpdate(publication.user, {contributionsNumber: contributionsNumber+1}, (err, countUpdated) =>{
			});
		}); // 
		
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
				building.address.apartment      = params.apartment ? params.apartment : null;
				building.typeOfBuilding         = publication.typeOfBuilding;
				building.globalRate             = publication.rate;
				building.globalNoise            = publication.noise;
				building.globalPriceBenefit     = publication.priceBenefit;
				building.globalLandlordSupport  = publication.landlordSupport;
				building.globalMaintenance      = publication.maintenance;
				building.reviewsCounter         = 1;
				building.created_at             = publication.created_at;
				building.save((err, buildingStored) => {
					if(err) return res.status(500).send({message: 'Error when creating building'});
					if(buildingStored){
						res.status(200).send({building: buildingStored, publication: publicationStored});
					}else{
						res.status(404).send({message: 'Error when creating building from publication, not saved'});
					}
				});
			}else{
				// Address exists but perhaps aparment dont, Check for apartment as well, if it doesnt exist, then create record
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
						building.typeOfBuilding         = publication.typeOfBuilding;
						building.globalRate             = publication.rate;
						building.globalNoise            = publication.noise;
						building.globalPriceBenefit     = publication.priceBenefit;
						building.globalLandlordSupport  = publication.landlordSupport;
						building.globalMaintenance      = publication.maintenance;
						building.reviewsCounter         = 1;
						building.created_at             = publication.created_at;
						building.save((err, buildingStored) => {
							if(err) return res.status(500).send({message: 'Error when creating building - apartment'});
							if(buildingStored){
								res.status(200).send({building: buildingStored, publication: publicationStored});
							}else{
								res.status(404).send({message: 'Error when creating building apt from publication, not saved'});
							}
						});
					}else{
						// If building already exist, then
						// reviewsCounter must increase
						var apartment = params.apartment ? params.apartment : null;
						Building.findOne({'address.apartment'      : apartment,
									  	  'address.country'        : params.country,
							  		  	  'address.state'          : params.state,
							  		  	  'address.city'           : params.city,
							  		  	  'address.street'         : params.street,
							  		  	  'address.buildingNumber' : params.buildingNumber,
							  		  	  'address.zip'            : params.zip}).exec((err, pubInf) => {
							var reviewsNumber = pubInf.reviewsCounter;
							Building.findByIdAndUpdate(pubInf.id, {reviewsCounter: reviewsNumber+1}, (err, reviewsCountUpdated) =>{
							});
						}); // 
						return res.status(200).send({publication: publicationStored});
					}
				});
			}
		});
	});
}

function getPublication(req, res){
	var publicationId = req.params.id;

	Publication.findById(publicationId, (err, publication) =>{
		if(err) return res.status(500).send({message: 'Error when retrieving review'});
		if(!publication) return res.status(404).send({message: 'publication doesnt exist'});
			return res.status(200).send({publication});
	});
}

function deletePublication(req, res){
	var publicationId = req.params.id;

	Publication.find({'user': req.user.sub, '_id': publicationId}).remove((err, publicationRemoved)=> {
		if(err) return res.status(500).send({message: 'Error when deleting review'});
		if(!publicationRemoved) return res.status(404).send({message: 'review was not deleted'});
		return res.status(200).send({message: 'Publication removed'});
	});
}

function uploadImageOnExistingPublication(req, res){
	var publicationId = req.params.id;

	if(req.files){
		var file_path  = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name  = file_split[2];
		var ext_split  = file_name.split('.');
		var file_ext   = ext_split[1];

		if (file_ext=='png' || file_ext=='jpg' || file_ext=='jpeg'){
			// Check if user is owner of that publication
			Publication.findOne({'user':req.user.sub, '_id':publicationId}).exec((err, publication) => {
				if(publication){
					// If user is owner, then add picture
					Publication.findByIdAndUpdate(publicationId, {$push: {file: file_name}}, {new: false}, (err, publicationUpdated) =>{
						if(err) return res.status(500).send({message: 'Error in request'});
						if(!publicationUpdated) return res.status(404).send({message: 'Couldnot upload image'});
						return res.status(200).send({publication: publicationUpdated});
					});
				}else{
					return removeFilesOfUploads(res, file_path, 'You are not allowed to upload images');
				}
			});
		}else{
			return removeFilesOfUploads(res, file_path, 'Extension not valid');
		}
	}else{
		return res.status(200).send({message: 'Image was not uploaded'});
	}
}

function uploadImage(req, res){
	var publicationId = req.params.publicationId;

	if(req.files){
		var file_path  = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name  = file_split[2];
		var ext_split  = file_name.split('.');
		var file_ext   = ext_split[1];

		if (file_ext=='png' || file_ext=='jpg' || file_ext=='jpeg'){

			Publication.findByIdAndUpdate(publicationId, {$push: {file: file_name}}, {new: true}, (err, publicationUpdated) =>{
						if(err) return res.status(500).send({message: 'Error in request'});
						if(!publicationUpdated) return res.status(404).send({message: 'Couldnot upload image'});

						return res.status(200).send({publication: publicationUpdated});
					});
		}else{
			return removeFilesOfUploads(res, file_path, 'Extension not valid');
		}
	}else{
		return res.status(200).send({message: 'Image was not uploaded'});
	}
}

function removeFilesOfUploads(res, file_path, message){
	fs.unlink(file_path, (err) =>{
		return res.status(200).send({message: message});
	});
}

function getImageFile(req, res){
	var image_file = req.params.imageFile;
	var path_file = './uploads/publications/'+image_file;

	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'Image does not exist'});
		}
	});
}

function upDownVote(req, res){
	var vote = req.body.vote;
	var publicationId = req.params.publicationId;
	Publication.findOne({'_id':publicationId}).exec((err, publication) => {
		if(publication){
			var newVote = publication.votesCounter + parseInt(vote);
			Publication.findByIdAndUpdate(publicationId, {votesCounter: newVote}, (err, publicationUpdated) =>{
						
						if(err) return res.status(500).send({message: 'Error in voting request'});
						if(!publicationUpdated) return res.status(404).send({message: 'Votes not updated'});
						return res.status(200).send({publication: publicationUpdated});
					});
		}else{
			return res.status(404).send({message: 'Publication not found'});
		}
	});
}

module.exports = {
	probando,
	savePublication,
	getPublication,
	deletePublication,
	uploadImage,
	getImageFile,
	upDownVote
}