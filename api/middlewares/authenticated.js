'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_FlatMeUp';

// When we enter to the middleware, until we execute the "next", we will not go out from here
exports.ensureAuth = function(req, res, next){
	if(!req.headers.authorization){
		return res.status(403).send({message: "The request doesnt have authentification header"});
	}

	var token = req.headers.authorization.replace(/['"]+/g, '');

	try{
		var payload = jwt.decode(token, secret);

		if(payload.ex <= moment().unix()){
			return res.status(401).send({message: 'Expired Token'});
		}
	}catch(ex){
		return res.status(404).send({message: 'Invalid Token'});
	}
	
	req.user = payload;
	next();
}