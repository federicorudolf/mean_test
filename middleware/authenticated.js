'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_key'

exports.ensuerAuth = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).send({message: 'Request does not have authentication headers'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()) {
            return res.status(401).send({message: 'Session has expired'});
        }

    } catch (ex) {
        // console.log(ex);
        return res.status(404).send({message: 'Token is not valid'});
    }

    req.user = payload;

    next();

}