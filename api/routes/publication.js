'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/publications'});

api.get('/probando-pub', md_auth.ensureAuth, PublicationController.probando);
api.post('/write-a-review', md_auth.ensureAuth, PublicationController.savePublication);
api.get('/review/:id', md_auth.ensureAuth, PublicationController.getPublication);
api.delete('/review/:id', md_auth.ensureAuth, PublicationController.deletePublication);
api.post('/upload-image/:publicationId', [md_auth.ensureAuth, md_upload], PublicationController.uploadImage);
api.get('/get-image/:imageFile', PublicationController.getImageFile);
api.post('/vote/:publicationId', md_auth.ensureAuth, PublicationController.upDownVote);
module.exports = api;