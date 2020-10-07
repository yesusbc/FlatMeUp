'use strict'

const express            = require('express');
const BuildingController = require('../controllers/building');
const api                = express.Router();
const md_auth            = require('../middlewares/authenticated');
const multipart          = require('connect-multiparty');
const md_upload          = multipart({ uploadDir: './uploads/publications'});

api.get('/testbuilding', BuildingController.testbuilding);
api.post('/create-building', BuildingController.createBuilding);
api.get('/get-buildings/:page?', BuildingController.getBuildings);
api.get('/get-building/:buildingId', BuildingController.getBuildingById);
api.post('/get-building-loc/:page?', BuildingController.getBuildingsByAddress);
api.post('/upload-image-building/:buildingId', [md_auth.ensureAuth, md_upload], BuildingController.uploadImage);

module.exports = api;


