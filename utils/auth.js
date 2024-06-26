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
            response.cookie('authToken', request.authentication.applicationJwtToken, request.cookieOptions);
            response.cookie('refreshToken', request.authentication.applicationRefreshToken, {
                ...request.cookieOptions,
                expires: request.authentication.refreshTokenExpiry });            
            response.writeHead(200, {'Content-Type': 'text/html'})
            /* todo: should return our own token */
            response.end(JSON.stringify({
                authenticated: true,
                tokenExpiry: request.authentication.tokenExpiry,
                refreshTokenExpiry: request.authentication.refreshTokenExpiry,
                picture:request.authentication.picture,
                familyName:request.authentication.familyName,
                givenName:request.authentication.givenName
            }))
        } else {
            response.writeHead(401, {'Content-Type': 'text/html'})
            response.end("Authentication Failed")
        }
    })

    router.post('/refresh',postReceiver, authenticationManager.refreshManager, function(request, response){
        /* todo put final handling in a middleware */
        if (request.authentication.isAuthenticated){
            response.cookie('authToken', request.authentication.applicationJwtToken, request.cookieOptions,);
            response.cookie('refreshToken', request.authentication.applicationRefreshToken, {
                ...request.cookieOptions,
                expires: request.authentication.refreshTokenExpiry });            
            response.writeHead(200, {'Content-Type': 'text/html'})
            /* todo: should return our own token */
            response.end(JSON.stringify({
                /*applicationJwtToken: request.authentication.applicationJwtToken,*/
                authenticated: true,
                tokenExpiry: request.authentication.tokenExpiry,
                refreshTokenExpiry: request.authentication.refreshTokenExpiry,
                picture:request.authentication.picture,
                familyName:request.authentication.familyName,
                givenName:request.authentication.givenName
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
            jwtCreator.jwtCreate(userData,request).then(
                value => {
                    request.lm.logger.info(value)
                    response.writeHead(200, {'Content-Type': 'text/html'})
                    response.end(value)
                },
                reason => {
                    request.lm.logger.error(reason)
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

            jwtCreator.jwtValidate(token,request).then(
                value => {
                    request.lm.logger.info(value)
                },
                reason => {
                    request.lm.logger.error(reason)
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
    
