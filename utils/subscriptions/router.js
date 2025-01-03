const express = require('express')
const router = express.Router()
const common = require('../requestManager.js')
const postReceiver = require('../postReceiver.js')
const authenticationManager = require('../authenticationManager.js')
const SubscriptionService = require('./service')


router.post('/', authenticationManager.verificationManager, function(request, response){
        /* todo put final handling in a middleware */
        common.callServiceAndAnswer(SubscriptionService.addSubscription,{userId:request.authentication.applicationUserId,subscription:request.body},response,request);
        
        // if (request.authentication.isAuthenticated){
        //     response.cookie('authToken', request.authentication.applicationJwtToken, request.cookieOptions);
        //     response.cookie('refreshToken', request.authentication.applicationRefreshToken, {
        //         ...request.cookieOptions,
        //         expires: request.authentication.refreshTokenExpiry });            
        //     response.writeHead(200, {'Content-Type': 'text/html'})
        //     /* todo: should return our own token */
        //     response.end(JSON.stringify({
        //         authenticated: true,
        //         tokenExpiry: request.authentication.tokenExpiry,
        //         refreshTokenExpiry: request.authentication.refreshTokenExpiry,
        //         picture:request.authentication.picture,
        //         familyName:request.authentication.familyName,
        //         givenName:request.authentication.givenName
        //     }))
        // } else {
        //     response.writeHead(401, {'Content-Type': 'text/html'})
        //     response.end("Authentication Failed")
        // }
    })

    module.exports = router;