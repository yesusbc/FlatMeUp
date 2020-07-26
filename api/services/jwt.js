'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_seccreta_FlatMeUp';

exports.createToken = function (user){
	var payload = {
		sub: user._id,
		name: user.name,
		userName: user.userName,
		email: user.email,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix
	};

	return jwt.encode(payload, secret);
};