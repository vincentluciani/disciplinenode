const express = require('express')
const router = express.Router()
const HabitsService = require('../services/HabitsService')
const common = require('../utils/requestManager')

const postReceiver = require('./postReceiver.js')
const authenticationManager = require('./authenticationManager.js')


router.post('/',postReceiver, authenticationManager.authorizationManager, function(request, response){
        /* todo put final handling in a middleware */
        if (request.authentication.isAuthenticated){
            response.writeHead(200, {'Content-Type': 'text/html'})
            response.end(request.authentication.picture)
        } else {
            response.writeHead(401, {'Content-Type': 'text/html'})
            response.end("Authentication Failed")
        }
    })

    module.exports = router;