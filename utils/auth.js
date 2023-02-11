const express = require('express')
const router = express.Router()
const HabitsService = require('../services/HabitsService')
const common = require('../utils/requestManager')
const jwtCreator = require('./jwtManager.js')
const postReceiver = require('./postReceiver.js')
const authenticationManager = require('./authenticationManager.js')


router.post('/',postReceiver, authenticationManager.authorizationManager, function(request, response){
        /* todo put final handling in a middleware */
        if (request.authentication.isAuthenticated){
            response.writeHead(200, {'Content-Type': 'text/html'})
            /* todo: should return our own token */
            response.end(JSON.stringify({
                applicationJwtToken: request.authentication.applicationJwtToken,
                picture:request.authentication.picture
            }))
        } else {
            response.writeHead(401, {'Content-Type': 'text/html'})
            response.end("Authentication Failed")
        }
    })


    
    router.post('/testcreatetoken',postReceiver, function(request, response){
        /* todo put final handling in a middleware */
        if (request.body){

            userData={userId:'e434343434'}
            jwtCreator.jwtCreate(userData).then(
                value => {
                    console.log(value)
                    response.writeHead(200, {'Content-Type': 'text/html'})
                    response.end(value)
                },
                reason => {
                    console.log(reason)
                    response.writeHead(401, {'Content-Type': 'text/html'})
                    response.end(reason)
                }
            )


        } else {
            response.writeHead(401, {'Content-Type': 'text/html'})
            response.end("Authentication Failed")
        }
    })

    router.post('/testreceivetoken',postReceiver, function(request, response){
        /* todo put final handling in a middleware */
        if (request.body){
            var token = request.headers['x-access-token']

            jwtCreator.jwtValidate(token).then(
                value => {
                    console.log(value)
                },
                reason => {
                    console.log(reason)
                }
            )

            response.writeHead(200, {'Content-Type': 'text/html'})
            /* todo: should return our own token */
            response.end(request.body)
        } else {
            response.writeHead(401, {'Content-Type': 'text/html'})
            response.end("Authentication Failed")
        }
    })

    module.exports = router;
    
