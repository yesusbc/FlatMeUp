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

	if(!params.address || !params.text){
		return res.status(200).send({
			message: 'Either address or text is missing'
		});
	}

	var publication = new Publication();

	publication.user       = req.user.sub;
	publication.address    = params.address;
	publication.text       = params.text;
	publication.file       = 'null';
	publication.created_at = moment().unix();
	publication.apartment               = params.apartment               ? params.apartment               : null;
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
			User.findByIdAndUpdate(publication.user, {contributionsNumber: contributionsNumber+1}, (err, countUpdated) =>{
			});
		}); // 
		
		// If address doesnt exist, then create new record
		Building.findOne({'address': publication.address}).exec((err, addressExists) => {
			if(!addressExists){
				var building                   = new Building();
				building.address               = publication.address;
				building.apartment             = publication.apartment;
				building.globalRate            = publication.rate;
				building.globalNoise           = publication.noise;
				building.globalPriceBenefit    = publication.priceBenefit;
				building.globalLandlordSupport = publication.landlordSupport;
				building.globalMaintenance     = publication.maintenance;
				building.reviewsCounter        = 1;
				building.created_at            = publication.created_at;
				building.save((err, buildingStored) => {
					if(err) return res.status(500).send({message: 'Error when creating building'});
					if(buildingStored){
						res.status(200).send({building: buildingStored, publication: publicationStored});
					}else{
						res.status(404).send({message: 'Error when creating building from publication, not saved'});
					}
				});
			}else{
				// Check for apartment as well, if it doesnt exist, then create record
				Building.findOne({'address': publication.address, 'apartment': publication.apartment}).exec((err, addressExists) => { 
					if(!addressExists){
						var building                   = new Building();
						building.address               = publication.address;
						building.apartment             = publication.apartment;
						building.globalRate            = publication.rate;
						building.globalNoise           = publication.noise;
						building.globalPriceBenefit    = publication.priceBenefit;
						building.globalLandlordSupport = publication.landlordSupport;
						building.globalMaintenance     = publication.maintenance;
						building.reviewsCounter        = 1;
						building.created_at            = publication.created_at;
						building.save((err, buildingStored) => {
							if(err) return res.status(500).send({message: 'Error when creating building - apartment'});
							if(buildingStored){
								res.status(200).send({building: buildingStored, publication: publicationStored});
							}else{
								res.status(404).send({message: 'Error when creating building apt from publication, not saved'});
							}
						});
					}else{
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

function uploadImage(req, res){
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

function removeFilesOfUploads(res, file_path, message){
	fs.unlink(file_path, (err) =>{
		return res.status(200).send({message: message});
	});
}

function getImageFile(req, res){
	var image_file = req.params.imageFile;
	console.log(image_file);
	var path_file = './uploads/publications/'+image_file;
	console.log(path_file);

	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'Image does not exist'});
		}
	});
}

module.exports = {
	probando,
	savePublication,
	getPublication,
	deletePublication,
	uploadImage,
	getImageFile
}