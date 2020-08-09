'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Message = require('../models/message');

function probando(req, res){
	res.status(200).send({
		message: 'Message test'
	});
}

function saveMessage(req, res){
	var params = req.body;

	if(!params.text || !params.receiver) return res.status(200).send({message: 'Missing text or receiver'});

	var message = new Message();
	message.text = params.text;
	message.created_at = moment().unix();
	message.emitter = req.user.sub;
	message.receiver = params.receiver;
	message.viewed = 0;
	message.save((err, messageStored) => {
		if(err) return res.status(500).send({message: 'Error in message'});
		if(!messageStored) return res.status(500).send({message: 'Message not sent'});

		res.status(200).send({message: messageStored});
	});
}

function getReceivedMessages(req, res){
	var userId = req.user.sub;

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;
	Message.find({receiver: userId}).populate('emitter', 'name userName email _id').paginate(page, itemsPerPage, (err, messages, totalMessages) => {	
		if(err) return res.status(500).send({message: 'Error in messages request'});
		if(!messages) return res.status(404).send({message: 'No messages'});

		return res.status(200).send({
			total: totalMessages,
			pages: Math.ceil(totalMessages/itemsPerPage),
			messages
		});
	});
}

function getEmittedMessages(req, res){
	var userId = req.user.sub;

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;
	// emmiter receiver ??
	Message.find({emitter: userId}).populate('emitter', 'name userName email _id').paginate(page, itemsPerPage, (err, messages, totalMessages) => {	
		if(err) return res.status(500).send({message: 'Error in messages request'});
		if(!messages) return res.status(404).send({message: 'No messages'});

		return res.status(200).send({
			total: totalMessages,
			pages: Math.ceil(totalMessages/itemsPerPage),
			messages
		});
	});
}

function getUnviewedMessages(req, res){
	var userId = req.user.sub;

	Message.count({receiver: userId, viewed: 0}).exec((err, messagesCount) =>{
		if(err) return res.status(500).send({message: 'Error in messages unviewed request'});
		if(!messagesCount) return res.status(404).send({message: 'No messages'});
		return res.status(200).send({
			'unviewed': messagesCount
		});
	});
}
function setViewedMessages(req, res){
	var userId = req.user.sub;

	Message.update({receiver: userId, viewed: 0}, {viewed: 1}, {"multi":true}, (err, messagesUpdated) =>{
		if(err) return res.status(500).send({message: 'Error in messages viewed request'});
		return res.status(200).send({
			messages: messagesUpdated
		});
	});
}


module.exports = {
	probando,
	saveMessage,
	getReceivedMessages,
	getEmittedMessages,
	getUnviewedMessages,
	setViewedMessages
}