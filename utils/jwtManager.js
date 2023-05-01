
let jwt = require('jsonwebtoken');

const jwtCreate = async (userData,request) =>{

    var jwtOptions = {
        // audience :  ["http://localhost:3000","https://brainstrive","https://www.brainstrive.com"],
         issuer : "https://www.vince.com",
         expiresIn : '1d',
         //iat : nowSeconds
       };

    let token = jwt.sign(userData, request.configuration.secretKey,jwtOptions);
    request.lm.logger.info("creating token")
    return token
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
    jwtValidate:jwtValidate
  }