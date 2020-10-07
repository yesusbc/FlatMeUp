'use strict'

require('dotenv').config();

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = process.env.SECRET_KEY;

exports.createToken = function (user) {
	const payload = {
		sub: user._id,
		name: user.name,
		userName: user.userName,
		email: user.email,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix
	};

	return jwt.encode(payload, secret);
};