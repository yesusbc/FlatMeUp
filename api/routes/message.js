'use strict'

const express           = require('express');
const MessageController = require('../controllers/message');
const api               = express.Router();
const md_auth           = require('../middlewares/authenticated');

api.get('/testing-md', md_auth.ensureAuth, MessageController.tesmessage);
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/inbox/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getEmittedMessages);
api.get('/unviewed-messages', md_auth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);

module.exports = api;