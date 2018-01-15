'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');

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
    user.role = 'ROLE_USER';
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
        })
    } else {
        res.status(200).send({message: 'Set password'})
    }

}

module.exports = {
    pruebas,
    saveUser
};