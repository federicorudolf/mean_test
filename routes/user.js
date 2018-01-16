'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middleware/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' })

var api = express.Router();

api.get('/testingController', md_auth.ensuerAuth, UserController.pruebas );
api.post('/registration', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensuerAuth, UserController.updateUser);
api.post('upload-image-user/:id', [ md_auth.ensuerAuth, md_upload ], UserController.uploadImage)

module.exports = api;