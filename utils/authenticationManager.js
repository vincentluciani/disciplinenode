const jwtManager = require('./jwtManager.js')

const {OAuth2Client} = require('google-auth-library');
require('./User');

// for api call other than auth
const verificationManager =  (request, result, next) =>{

    //const token=request.body.replace(/token=(\w*)/,'$1');
    const token = request.cookies.authToken
    const logger = request.lm.logger
    applicationAuthenticate(token, request).then(
        value => {
            request.authentication = value
            next();
        },
        reason => {
            logger.error(reason)
            request.authentication = {
            isAuthenticated: false,
            picture: ''
            }
            result.statusCode = 500;
            response.send('Error Processing Your Request');
            logger.error('Error Processing the Request:'+  request.originalUrl)
            logger.error(request.body)
            logger.error(reason.message)
            logger.error(reason.stack)
            return
        }
    )     
}

// special for auth
const authorizationManager =  (request, result, next) =>{

    const token=request.body.replace(/token=(\w*)/,'$1');
    
    //const token = request.body.token
    
    authenticateAndAddUser(token, request, request.mongoose).then(
        value => {
            request.authentication = value
            next()
        },
        reason => {
            request.lm.logger.error(reason)
            request.authentication = {
            isAuthenticated: false,
            picture: ''
            }
            next();
        }
    )     
}

const authenticateAndAddUser = async (token,request,mongoose) => {

    const authentication = await googleAuthenticate(token, request.configuration,mongoose)
    if (!authentication.applicationUser) {
        
        authentication.applicationUser  = await addUser(authentication,mongoose)

    }
    
    const userInformation = {
        userId:authentication.applicationUser
    }
    const jwtObject = await jwtManager.jwtCreate(userInformation,request)
    authentication.applicationJwtToken = jwtObject.applicationJwtToken
    authentication.tokenExpiry = jwtObject.expiration
    const jwtRefreshObject = await jwtManager.generateRefreshToken(userInformation,request)
    authentication.applicationRefreshToken = jwtRefreshObject.refreshAuthToken
    authentication.refreshTokenExpiry = jwtRefreshObject.expiration
    /* TODO PUT IN A DATABASE INSTEAD OF THE PREVIOUS ENTRY - KEY = ??*/
        
    return authentication

}

const addUser = async (authentication,mongoose) => {
    
    const User = mongoose.model('users');
    const newUser = {
        userGoogleId: authentication.googleUserId,
        userType: 'google'
    }
    new User(newUser).save()
    .then(
        (savedUser) => {
            user = savedUser
            return user.id
        }
    );
    
}

const googleAuthenticate = async (token,configuration,mongoose) => {

    const payload = await verify(token, configuration);

    let authentication = {
        isAuthenticated: true,
        picture: payload.picture,
        googleUserId: payload.sub,
        email: payload.email,
        familyName: payload.family_name,
        givenName: payload.given_name
    }

    const User = mongoose.model('users');
    //User.findOne({userGoogleId:authentication.googleUserId})

    let user = await User.findOne({userGoogleId:authentication.googleUserId})

    if (user){
        authentication.applicationUser = user.id
    }

    return authentication;

}


const applicationAuthenticate = async (token,request) => {

    //const token =  request.body.token
    
    const payload = await jwtManager.jwtValidate(token,request)

    const User = request.mongoose.model('users')
    //User.findOne({_id: payload.userId})

    let user = await User.findOne({_id: payload.userId})

    if (user){
        return {
            isAuthenticated: true,
            applicationUserId: payload.userId
        }
    } else {
        return {
            isAuthenticated: false
        }
    }

}
const verify = async (token,configuration) => {
    const client = new OAuth2Client(configuration.clientId);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: configuration.clientId
    });
    const payload = ticket.getPayload();

    return payload;
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}
  
// Handle refresh token
// TODO
const refreshManager =  (request, result, next) =>{

    const refreshToken = request.cookies.refreshToken;
/* TODO CHECK IF TOKEN ALREADY THERE IN DB AS PARENT OR GRANDPARENT ?- IF YES, DENY as refresh token already used*/
    handleRefreshToken(refreshToken, request).then(
        value => {
            request.authentication = value
            next()
        },
        reason => {
            request.lm.logger.error(reason)
            request.authentication = {
            isAuthenticated: false,
            picture: ''
            }
            next();
        }
    )     
}

const handleRefreshToken = async (token,request) => {

    const authentication = await applicationAuthenticate(token,request)
    if (authentication) {    
        const userInformation = {
            userId:authentication.applicationUserId
        }
        const applicationJwtToken = await jwtManager.jwtCreate(userInformation,request)
        authentication.applicationJwtToken = applicationJwtToken.applicationJwtToken
        authentication.tokenExpiry = applicationJwtToken.expiration
        const applicationRefreshToken = await jwtManager.generateRefreshToken(userInformation,request)
        authentication.applicationRefreshToken = applicationRefreshToken.refreshAuthToken
        authentication.refreshTokenExpiry = applicationRefreshToken.expiration

        /* TODO PUT IN A DATABASE INSTEAD OF THE PREVIOUS ENTRY - KEY = ??*/
        

        return authentication

    } else {
        return null
    }

}

module.exports = {
    verificationManager: verificationManager,
    authorizationManager: authorizationManager,
    refreshManager
  }