'use strict'

var express = require('express');
var BuildingController = require('../controllers/building');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// var multipart = require('connect-multiparty');
// var md_upload = multipart({ uploadDir: './uploads/publications'});

api.get('/testbuilding', BuildingController.testbuilding);
api.post('/create-building', BuildingController.createBuilding);

module.exports = api;


