'use strict'

var express            = require('express');
var BuildingController = require('../controllers/building');
var api                = express.Router();
var md_auth            = require('../middlewares/authenticated');
var multipart          = require('connect-multiparty');
var md_upload          = multipart({ uploadDir: './uploads/publications'});

api.get('/testbuilding', BuildingController.testbuilding);
api.post('/create-building', BuildingController.createBuilding);
api.get('/get-buildings/:page?', BuildingController.getBuildings);
api.get('/get-building/:buildingId', BuildingController.getBuildingById);
api.post('/get-building-loc/:page?', BuildingController.getBuildingsByAddress);
api.post('/upload-image-building/:buildingId', [md_auth.ensureAuth, md_upload], BuildingController.uploadImage);

module.exports = api;


