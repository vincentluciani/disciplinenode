const {OAuth2Client} = require('google-auth-library');


/* TODO : there should be authenticate authenticateWithCreation

module.exports = {
  func1: func1,
  func2: func2
}

*/

const authenticationManager =  (request, result, next) =>{

    const token=request.body.replace(/token=(\w*)/,'$1');

    googleAuthenticate(token, request.configuration).then(
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

    // verify(token, request.configuration).then(
    //   value => {
    //       request.authentication = {
    //         isAuthenticated: true,
    //         picture: value.picture
    //       }
    //       const userid = value['sub'];
    //       next();
    //   },
    //   reason => {
    //       console.log(reason)
    //       request.authentication = {
    //         isAuthenticated: false,
    //         picture: ''
    //       }
    //       next();
    //   }
    // )     

}

const googleAuthenticate = async (token,configuration) => {

    const payload = await verify(token, configuration);

    const authentication = {
        isAuthenticated: true,
        picture: payload.picture
    }
    
    const googleUserid = payload['sub'];
    const email = payload.email

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
  
module.exports = authenticationManager