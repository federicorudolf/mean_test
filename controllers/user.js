'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Testing user controller action'
    });
}

function saveUser(req, res) {
    var user = new User();
    var params = req.body;

    console.log(params);
    
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';
    
    if(params.password) {
        // Crypt pass & save user
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            if(user.name !== null && user.surname !== null && user.email !== null) {
                user.save((err, userStored) => {
                    if(err) {
                        res.status(500).send({message: 'Could not save user'})
                    } else {
                        if(!userStored) {
                            res.status(404).send({message: 'Could not save user'})
                        } else {
                            res.status(200).send({user: userStored, message: 'Succesfully saved user :)'});
                        }
                    }
                });
            } else {
                res.status(200).send({message: 'Fill every field'})
            }
        });
    } else {
        res.status(200).send({message: 'Set password'})
    }
}

function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err) {
            res.status(500).send({message: 'Login request error'});
        } else {
            if(!user){
                res.status(404).send({message: 'User does not exist'});
            } else {
                bcrypt.compare(password, user.password, (err, check) => {
                    if(check){
                        if(params.getHash){
                            res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        } else {
                            res.status(200).send({user});
                        }
                    } else {
                        res.status(404).send({message: 'Wrong password'});
                    }
                })
            }
        }
    })
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if(err){
            res.status(500).send({message: 'Could not update user because of server error'})
        } else {
            if(!userUpdated) {
                res.status(404).send({message: 'Could not update user'})
            } else {
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'Not uploaded...';

    if(req.files) {
        var file_path = req.files.image.path;

        console.log(file_path);
        
    } else {
        res.status(200).send({message: 'No image has been uploaded'});
    }
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
};