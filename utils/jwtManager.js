
let jwt = require('jsonwebtoken');

const jwtCreate = async (userData) =>{

    var jwtOptions = {
        // audience :  ["http://localhost:3000","https://brainstrive","https://www.brainstrive.com"],
         issuer : "https://www.vince.com",
         expiresIn : '1d',
         //iat : nowSeconds
       };

    let token = jwt.sign(userData, 'test1secret',jwtOptions);
    console.log("creating token")
    return token
}

const jwtValidate = async (token) =>{
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
        const jwtResult = await jwt.verify(token, 'test1secret', jwtOptions)
        return jwtResult
    } catch(e) {
        console.log(e)
        return null
    }


}
module.exports = {
    jwtCreate: jwtCreate,
    jwtValidate:jwtValidate
  }