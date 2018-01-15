'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

api.get('/testingController', UserController.pruebas);

api.post('/registration', UserController.saveUser);

module.exports = api;