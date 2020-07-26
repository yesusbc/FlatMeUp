'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

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

function saveUser(req, res){
	var params = req.body;
	var user = new User();

	if (params.name && params.userName && params.email && params.password){
		user.name = params.name;
		user.userName = params.userName;
		user.email = params.email;
		user.role = 'ROLE_USER';
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

function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email}, (err, user) => {
		if(err) return res.status(500).send({message: 'Error in request'});

		if (user){
			bcrypt.compare(password, user.password, (err, check) => {
				if(check){
					// return user data, without password
					user.password = undefined;
					return res.status(200).send({user});
				}else{
					return res.status(404).send({message: 'User Authentication Failed'});
				}
			});
		}else{
			return res.status(404).send({message: 'User not found'});
		}
	});
}

module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser
}