'use strict'

var express           = require('express');
var MessageController = require('../controllers/message');
var api               = express.Router();
var md_auth           = require('../middlewares/authenticated');

api.get('/testing-md', md_auth.ensureAuth, MessageController.tesmessage);
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/inbox/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getEmittedMessages);
api.get('/unviewed-messages', md_auth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);

module.exports = api;