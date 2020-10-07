'use strict'

const mongoosePaginate = require('mongoose-pagination');
const moment           = require('moment');
const User             = require('../models/user');
const Message          = require('../models/message');

function tesmessage(req, res){
	res.status(200).send({
		message: 'Message controller testing'
	});
}

// Function to save new message sent
// Args: Message
// Returns: -
function saveMessage(req, res){
	const params = req.body;
	if(!params.text || !params.receiver) return res.status(200).send({message: 'Missing text or receiver'});

	var message        = new Message();
	message.text       = params.text;
	message.address    = params.address;
	message.created_at = moment().unix();
	message.emitter    = req.user.sub;
	message.receiver   = params.receiver;
	message.viewed     = 0;
	message.save((err, messageStored) => {
		if(err) return res.status(500).send({message: 'Error in message'});
		if(!messageStored) return res.status(500).send({message: 'Message not sent'});
		res.status(200).send({message: messageStored});
	});
}

// Function get received messages
// Args: userId
// Return: Received Messages
function getReceivedMessages(req, res){
	const userId = req.user.sub;
	var page   = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;
	Message.find({receiver: userId}).populate('emitter', 'name lastname userName email address _id').sort('-created_at').paginate(page, itemsPerPage, (err, messages, totalMessages) => {	
		if(err) return res.status(500).send({message: 'Error in messages request'});
		if(!messages) return res.status(404).send({message: 'No messages'});
		return res.status(200).send({
			total: totalMessages,
			pages: Math.ceil(totalMessages/itemsPerPage),
			messages
		});
	});
}

// Function get emitted messages
// Args: userId
// Return: Sent Messages
function getEmittedMessages(req, res){
	const userId = req.user.sub;
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;
	Message.find({emitter: userId}).populate('emitter receiver', 'name lastname userName _id').sort('-created_at').paginate(page, itemsPerPage, (err, messages, totalMessages) => {	
		if(err) return res.status(500).send({message: 'Error in messages request'});
		if(!messages) return res.status(404).send({message: 'No messages'});
		return res.status(200).send({
			total: totalMessages,
			pages: Math.ceil(totalMessages/itemsPerPage),
			messages
		});
	});
}

// Function get unviewed messages
// Args: userId
// Return: Number of unviewed messages
function getUnviewedMessages(req, res){
	const userId = req.user.sub;

	Message.count({receiver: userId, viewed: 0}).exec((err, messagesCount) =>{
		if(err) return res.status(500).send({message: 'Error in messages unviewed request'});
		if(!messagesCount) return res.status(404).send({message: 'No messages'});
		return res.status(200).send({
			'unviewed': messagesCount
		});
	});
}

// Function that sets message's view parameter to true
// Args: userId
// Return: -
function setViewedMessages(req, res){
	const userId = req.user.sub;

	Message.update({receiver: userId, viewed: 0}, {viewed: 1}, {"multi":true}, (err, messagesUpdated) =>{
		if(err) return res.status(500).send({message: 'Error in messages viewed request'});
		return res.status(200).send({
			messages: messagesUpdated
		});
	});
}

module.exports = {
	tesmessage,
	saveMessage,
	getReceivedMessages,
	getEmittedMessages,
	getUnviewedMessages,
	setViewedMessages
}