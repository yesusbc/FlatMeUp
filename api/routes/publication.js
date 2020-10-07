'use strict'

const express               = require('express');
const PublicationController = require('../controllers/publication');
const api                   = express.Router();
const md_auth               = require('../middlewares/authenticated');
const multipart             = require('connect-multiparty');
const md_upload             = multipart({ uploadDir: './uploads/publications'});

api.get('/probando-pub', md_auth.ensureAuth, PublicationController.testpublication);
api.post('/write-a-review', md_auth.ensureAuth, PublicationController.savePublication);
api.get('/review/:id', PublicationController.getPublication);
api.get('/get-reviews-building/:buildingId/:page?', PublicationController.getPublicationsById);
api.get('/my-reviews/:page?', md_auth.ensureAuth, PublicationController.getPublicationsUser);
api.delete('/delete-review/:id', md_auth.ensureAuth, PublicationController.deletePublication);
api.post('/upload-image-pub/:publicationId', [md_auth.ensureAuth, md_upload], PublicationController.uploadImage);
api.get('/get-image/:imageFile', PublicationController.getImageFile);
api.post('/vote/:publicationId', md_auth.ensureAuth, PublicationController.upDownVote);

module.exports = api;