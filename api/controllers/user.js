'use strict'

const mongoosePaginate = require('mongoose-pagination');
const bcrypt           = require('bcrypt-nodejs');
const User             = require('../models/user');
const Publication      = require('../models/publication');
const jwt              = require('../services/jwt');

// Test Method
function home(req, res){
	res.status(200).send({
		message: 'Hello world from NodeJS server'
	});
}

// Test Method
function pruebas(req, res){
	console.log(req.body);
	res.status(200).send({
		message: 'Test user controller'
	});
}

// Function to register new User 
// Args: User
// Returns: -
function saveUser(req, res){
	const params = req.body;
	var user = new User();

	if (params.name && params.userName && params.email && params.password){
		user.name                = params.name;
		user.lastname            = params.lastname;
		user.userName            = params.userName;
		user.email               = params.email;
		user.contributionsNumber = 0;
		user.gender              = params.gender     ? params.gender     : null;
		user.occupation          = params.occupation ? params.occupation : null;
		user.country             = params.country    ? params.country    : null;
		user.state               = params.state      ? params.state      : null;
		user.city                = params.city       ? params.city       : null;
		user.birthday            = params.birthday   ? params.birthday   : null;
		user.role                = 'ROLE_USER';

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

// Function to control user's login
// Args: Users
// Return: 
function loginUser(req, res){
	const params   = req.body;
	const email    = params.email;
	const password = params.password;
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

// Function to get User's data
// Args: userId
// Returns: User
function getUser(req, res){
	const userId = req.params.id;
	User.findById(userId, (err, user) => {
		if(err) return res.status(500).send({message: 'Error in request'});
		if(!user) return res.status(404).send({message: 'User doesnt exist'});
		delete user.role;
		return res.status(200).send({user});
	});
}

// Return a paginated users list
// Function to get paginated Users
// Args: Optional: Page(1)
// Return: Users 
function getUsers(req, res){
	const identity_user_id = req.user.sub;
	const page = req.params.page ? req.params.page : 1;
	const itemsPerPage = 5;

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

// Function to edit user's data
// Args: userId
// Return:
function updateUser(req, res){
	const userId = req.params.id;
	const update = req.body;

	// Erase password property
	delete update.password;

	if(userId != req.user.sub) return res.status(500).send({ message: 'You are not allowed to acces to this user' });

	// Look for repeated userName or repeted Email
	User.find({ $or:[
				{ email: update.email.toLowerCase() },
				{ userName: update.userName.toLowerCase() }
				]}).exec((err, users) => {
					const user_isset = false;
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

// Function to get user's public data
// Args: userId
// Returns: User's public data
function getUserPublicData(req, res){
	const userId = req.params.destUserId;
	User.findById({'_id':userId},{name:1, lastname:1}, (err, user) => {
		if(err) return res.status(500).send({message: 'Error in request'});
		if(!user) return res.status(404).send({message: 'User doesnt exist'});
		return res.status(200).send({user});
	});
}

module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser,
	getUser,
	getUsers,
	updateUser,
	getUserPublicData
}