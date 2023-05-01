const jwtManager = require('./jwtManager.js')

const {OAuth2Client} = require('google-auth-library');
require('./User');

// for api call other than auth
const verificationManager =  (request, result, next) =>{

    //const token=request.body.replace(/token=(\w*)/,'$1');
    const token =  request.body.token
    const logger = request.lm.logger
    applicationAuthenticate(token, request, request.mongoose).then(
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
    const applicationJwtToken = await jwtManager.jwtCreate(userInformation,request)
    authentication.applicationJwtToken = applicationJwtToken
    
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


const applicationAuthenticate = async (token,request,mongoose) => {

    const payload = await jwtManager.jwtValidate(token,request);

    const User = mongoose.model('users');
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
  


module.exports = {
    verificationManager: verificationManager,
    authorizationManager: authorizationManager
  }