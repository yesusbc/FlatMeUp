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

// This function will save the publication, and if there is no existing building already, then it will create a new building
function savePublication(req, res){
	var params = req.body;
	if(!params.address.street || !params.text){
		return res.status(200).send({
			message: 'Either address or text is missing'
		});
	}
	var publication = new Publication();

	publication.user       = req.user.sub;
	publication.buildingId = null;
	publication.text       = params.text;
	publication.created_at = moment().unix();
	publication.address.country         = params.address.country         ? params.address.country                 : null;
	publication.address.state           = params.address.state           ? params.address.state                   : null;
	publication.address.city            = params.address.city            ? params.address.city                    : null;
	publication.address.street          = params.address.street          ? params.address.street                  : null;
	publication.address.buildingNumber  = params.address.buildingNumber  ? params.address.buildingNumber          : null;
	publication.address.apartment       = params.address.apartment       ? params.address.apartment               : "";
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
		console.log(publicationStored);
		if(err) return res.status(500).send({message: 'Error when saving publication'});
		if(!publicationStored) return res.status(404).send({message: 'Publication not saved'});

		// Contributions number + 1
		getContributionsNumber(publication.user).then((contributionsNumber) => {
			User.findByIdAndUpdate(publication.user, {contributionsNumber: contributionsNumber}, (err, countUpdated) =>{
			});
		}); 

		var building                    = new Building();
		building.address.country        = params.address.country;
		building.address.state          = params.address.state;
		building.address.city           = params.address.city;
		building.address.street         = params.address.street;
		building.address.buildingNumber = params.address.buildingNumber;
		building.address.zip            = params.address.zip;
		building.address.apartment      = params.address.apartment ? params.address.apartment : "";
		building.typeOfBuilding         = publication.typeOfBuilding;
		building.globalRate             = publication.rate;
		building.reviewsCounter         = 1;
		building.created_at             = publication.created_at;
		
		// Check if address exists
		Building.findOne({'address.country'        : params.address.country,
						  'address.state'          : params.address.state,
						  'address.city'           : params.address.city,
						  'address.street'         : params.address.street,
						  'address.buildingNumber' : params.address.buildingNumber,
						  'address.zip'            : params.address.zip}).exec((err, addressExists) => {
			if(!addressExists){
				// If address doesnt exist, then create new record
				building.save((err, buildingStored) => {
					if(err) return res.status(500).send({message: 'Error when creating building'});
					if(buildingStored){
						publicationStored.buildingId = buildingStored._id;
						Publication.findByIdAndUpdate(publication._id, {buildingId: buildingStored._id}, (err, buildingIdUpdated) =>{
							if(err) return res.status(500).send({message: 'Error when adding building ID to publication'});
						});
						res.status(200).send({building: buildingStored, publication: publicationStored});
					}else{
						res.status(404).send({message: 'Error when creating building from publication, not saved'});
					}
				});
			}else{
				// Address exists
				// Address exists but perhaps aparment dont, Check for apartment as well, if it doesnt exist, then create record
				Building.findOne({'address.apartment'      : params.address.apartment,
								  'address.country'        : params.address.country,
						  		  'address.state'          : params.address.state,
						  		  'address.city'           : params.address.city,
						  		  'address.street'         : params.address.street,
						  		  'address.buildingNumber' : params.address.buildingNumber,
						  		  'address.zip'            : params.address.zip}).exec((err, addressExists) => { 
					if(!addressExists){
						building.save((err, buildingStored) => {
							if(err) return res.status(500).send({message: 'Error when creating building - apartment'});
							if(buildingStored){
								publicationStored.buildingId = buildingStored._id;
								console.log(publicationStored.buildingId);
								Publication.findByIdAndUpdate(publication._id, {buildingId: buildingStored._id}, (err, buildingIdUpdated) =>{
								if(err) return res.status(500).send({message: 'Error when adding building ID to publication'});
								});
							}else{
								res.status(404).send({message: 'Error when creating building apt from publication, not saved'});
							}
						});
					}else{
						// If building and apartment already exist, then just add buildingId to publication
						Publication.findByIdAndUpdate(publication._id, {buildingId: addressExists._id}, (err, publicationUpdated) =>{
							if(err) return res.status(500).send({message: 'Error when adding building ID to publication'});
								// Update global stats
								// To check if value is returning 0 or digit
								Building.aggregate([
    							{
        							"$group": {
            						"_id": addressExists._id,
            						"globalRate": { "$avg": "$globalRate" }
        							}
    							}
								]).exec((err, stats) => {
									console.log(stats)
									if(err) console.log(err);
									var reviewsCounter = addressExists.reviewsCounter+1; 
									var lastAvg = stats[0]["globalRate"].toFixed(2);
									var newAvg = lastAvg;
									if (publication.rate){
										var newAvg = ((lastAvg*(reviewsCounter))+publication.rate)/(reviewsCounter).toFixed(2);
									}
									
									Building.findByIdAndUpdate(addressExists.id, {
										reviewsCounter: reviewsCounter,
										globalRate : newAvg,
									}, (err, updatedStats) =>{
								});
							});
						});

						return res.status(200).send({publication: publicationStored});
					}
				});
			}
		});
	});
}

async function getContributionsNumber(userId){
	var contributionsNumber = await User.findOne({'_id': userId}).exec((err, userInf) => {
			if(err) return err;
			return userInf.contributionsNumber;
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

function getPublicationsById(req, res){
	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}

	var buildingId = req.params.buildingId;
	var itemsPerPage = 4;

	Publication.find({'buildingId': buildingId}).sort('-created_at').paginate(page, itemsPerPage, (err, publications, totalPublications) => {	
		if (err) return res.status(500).send({message: 'Error when returning publications of user'});

		return res.status(200).send({
			total: totalPublications,
			pages: Math.ceil(totalPublications/itemsPerPage),
			publications
		});

	});
}

function getPublicationsUser(req, res){
	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}

	var user = req.user.sub;
	var itemsPerPage = 4;

	Publication.find({'user': user}).sort('-created_at').paginate(page, itemsPerPage, (err, publications, totalPublications) => {	
		if (err) return res.status(500).send({message: 'Error when returning publications of user'});

		return res.status(200).send({
			total: totalPublications,
			pages: Math.ceil(totalPublications/itemsPerPage),
			publications
		});

	});
}

function deletePublication(req, res){
	var publicationId = req.params.id;

	Publication.find({'user': req.user.sub, '_id': publicationId}).remove((err, publicationRemoved)=> {
		if(err) return res.status(500).send({message: 'Error when deleting review'});
		return res.status(200).send({message: 'Publication removed'});
	});
}

function uploadImage(req, res){
	var publicationId = req.params.publicationId;
	var filenames_list = [];

	if(req.files){
		if(req.files.image.length){
			for (var idx=0; idx < req.files.image.length; idx++){
				var file_path = req.files.image[idx].path;
				console.log(file_path);
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


		Publication.findByIdAndUpdate(publicationId, {$push: {file: filenames_list}}, {new: true}, (err, publicationUpdated) =>{
					if(err) return res.status(500).send({message: 'Error in request'});
					if(!publicationUpdated) return res.status(404).send({message: 'Couldnot upload image'});

					return res.status(200).send({publication: publicationUpdated});
				});
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
	getPublicationsUser,
	deletePublication,
	uploadImage,
	getImageFile,
	upDownVote,
	getPublicationsById
}