const {OAuth2Client} = require('google-auth-library');
require('./User');

// for api call other than auth
const verificationManager =  (request, result, next) =>{

    const token=request.body.replace(/token=(\w*)/,'$1');

    googleAuthenticate(token, request.configuration, request.mongoose).then(
        value => {
            request.authentication = value
            next();
        },
        reason => {
            console.log(reason)
            request.authentication = {
            isAuthenticated: false,
            picture: ''
            }
            next();
        }
    )     
}

// special for auth
const authorizationManager =  (request, result, next) =>{

    const token=request.body.replace(/token=(\w*)/,'$1');

    authenticateAndAddUser(token, request.configuration, request.mongoose).then(
        value => {
            request.authentication = value
            next();
        },
        reason => {
            console.log(reason)
            request.authentication = {
            isAuthenticated: false,
            picture: ''
            }
            next();
        }
    )     
}

const authenticateAndAddUser = async (token,configuration,mongoose) => {

    const authentication = await googleAuthenticate(token, configuration,mongoose)

    if (!authentication.applicationUser) {
        authentication.applicationUser  = await addUser(authentication,mongoose)
    }
    
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
        email: payload.email
    }

    const User = mongoose.model('users');
    User.findOne({userGoogleId:authentication.googleUserId})

    let user = await User.findOne({userGoogleId:authentication.googleUserId})

    if (user){
        authentication.applicationUser = user.id
    }

    return authentication;

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