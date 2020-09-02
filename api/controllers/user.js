'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var User = require('../models/user');
var Publication = require('../models/publication');
var jwt = require('../services/jwt');

// Test Methods
function home(req, res){
	res.status(200).send({
		message: 'Hola mundo desde el servidor de NodeJS'
	});
}

function pruebas(req, res){
	console.log(req.body);
	res.status(200).send({
		message: 'Test on server'
	});
}

// Register
function saveUser(req, res){
	var params = req.body;
	var user = new User();

	if (params.name && params.userName && params.email && params.password){
		user.name = params.name;
		user.lastname = params.lastname;
		user.userName = params.userName;
		user.email = params.email;
		user.contributionsNumber = 0;
		user.gender = params.gender ? params.gender : null;
		user.occupation = params.occupation ? params.occupation : null;
		user.country = params.country ? params.country : null;
		user.city = params.city ? params.city : null;
		user.birthday = params.birthday ? params.birthday : null;

		// user.image = null;

		// Look for repeated userName or repeted Email
		User.find({ $or: [
							{email: user.email.toLowerCase()},
							{userName: user.userName.toLowerCase()}
						]}).exec((err, users) => {
							if(err) return res.status(500).send({message: 'Error when retrieving users from database'});
							if(users && users.length >= 1){
								return res.status(200).send({mesage: 'Either username or email is already taken'});
							}else{
								// Encode password				
								bcrypt.hash(params.password, null, null, (err, hash) =>{
									user.password = hash;
									user.save((err, userStored) => {
										if(err) return res.status(500).send({message: 'Error when saving user'});
										if(userStored){
											res.status(200).send({user: userStored});
										}else{
											res.status(404).send({message: 'User not saved'});
										}
									});
								});
							}
						});
	}else{
		res.status(200).send({
			message: 'Data fields missing'
		});
	}
}

// Loggin
function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email}, (err, user) => {
		if(err) return res.status(500).send({message: 'Error in request'});

		if (user){
			bcrypt.compare(password, user.password, (err, check) => {
				if(check){
					if(params.gettoken){
						// Return token
						return res.status(200).send({
							// Generate token
							token: jwt.createToken(user)
						});
					}else{
						// return user data, without password
						user.password = undefined;
						return res.status(200).send({user});
					}
				}else{
					return res.status(404).send({message: 'User Authentication Failed'});
				}
			});
		}else{
			return res.status(404).send({message: 'User not found'});
		}
	});
}

// Get user data
function getUser(req, res){
	var userId = req.params.id;

	User.findById(userId, (err, user) => {
		if(err) return res.status(500).send({message: 'Error in request'});

		if(!user) return res.status(404).send({message: 'User doesnt exist'});

		return res.status(200).send({user});
	});
}

// Return a paginated users list
function getUsers(req, res){
	var identity_user_id = req.user.sub;

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 5;

	User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
		if(err) return res.status(500).send({message: 'Error in request'});

		if(!users) return res.status(404).send({message: 'No users available'});

		return res.status(200).send({
			users,
			total,
			pages: Math.ceil(total/itemsPerPage)
		});
	});
}

// Edit User data
function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	// Erase password property
	delete update.password;

	if(userId != req.user.sub) return res.status(500).send({message: 'You are not allowed to acces to this user'});

	// Look for repeated userName or repeted Email
	User.find({ $or:[
					{email: update.email.toLowerCase()},
					{userName: update.userName.toLowerCase()}
					]}).exec((err, users) => {
						var user_isset = false;
						users.forEach((user) => {
							if(user && user._id != userId) user_isset = true;
						});
						
						if(user_isset) return res.status(404).send({message: 'Data is already taken'});

		User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) =>{
			if(err) return res.status(500).send({message: 'Error in request'});

			if(!userUpdated) return res.status(404).send({message: 'User actualization Failed'});

			return res.status(200).send({user: userUpdated});
		});
	});
}

/*
function getCounters(req, res){
	var userId = req.user.sub;
	if(req.params.id){
		userId = req.params.id;
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
	home,
	pruebas,
	saveUser,
	loginUser,
	getUser,
	getUsers,
	updateUser
}