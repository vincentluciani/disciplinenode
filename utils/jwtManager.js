
let jwt = require('jsonwebtoken');
const crypto = require('crypto')

const jwtCreate = async (userData,request) =>{
    let authentication = {}
    var jwtOptions = {
        // audience :  ["http://localhost:3000","https://brainstrive","https://www.brainstrive.com"],
         issuer : "https://www.vince.com",
         expiresIn : '10m',
         //iat : nowSeconds
       };

    authentication.applicationJwtToken = jwt.sign(userData, request.configuration.secretKey,jwtOptions);
    request.lm.logger.info("creating token")


    const now = new Date(); // Get the current date and time
    now.setMinutes(now.getMinutes() + 10); // Add 10 minutes

    authentication.expiration = now

    return authentication
}

  // Generate a refresh token (custom function)
  const generateRefreshToken = async (userData,request) => {
    let authentication = {}
    const refreshJwtOptions = {
        issuer: 'https://www.vince.com',
        expiresIn: '30d', // Set a longer expiration time for the refresh token (e.g., 30 days)
      };
    // Generate a secure refresh token (you should use a secure library for this)
    //const refreshToken = crypto.randomBytes(32).toString('hex');

    // Sign the refresh token as a JWT
    //const refreshAuthToken = jwt.sign({ refreshToken }, request.configuration.secretKey, refreshJwtOptions);
    authentication.refreshAuthToken = jwt.sign(userData, request.configuration.secretKey,refreshJwtOptions);
    
    const currentDate = new Date();
    
    // Add one day (24 hours) to the current date
    currentDate.setDate(currentDate.getDate() + 30)

    authentication.expiration = currentDate

    return authentication;
  }

  
const jwtValidate = async (token,request) =>{
// jwt.verify(token, global.config.secretKey
    var jwtOptions = {
        // audience :  ["http://localhost:3000","https://brainstrive","https://www.brainstrive.com"],
        issuer : "https://www.vince.com",
        expiresIn : '1d'
        //iat : nowSeconds
    };
    /*jwt.verify(token, 'test1secret', jwtOptions, function (err, decoded) {
        if (err) {
            let errordata = {
                message: err.message,
                expiredAt: err.expiredAt
            }
            console.log(errordata)
            return 'Unauthorized Access'
        }

        console.log(decoded);
        return decoded;
    });*/
    try{
        const jwtResult = await jwt.verify(token, request.configuration.secretKey, jwtOptions)
        request.lm.logger.info("application token verification successful")
        return jwtResult
    } catch(e) {
        request.lm.logger.error("Error when verifying application token")
        request.lm.logger.error(e)
        return null
    }


}
module.exports = {
    jwtCreate: jwtCreate,
    jwtValidate:jwtValidate,
    generateRefreshToken
  }