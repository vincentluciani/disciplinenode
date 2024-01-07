const express = require('express')
const router = express.Router()

router.get('/', function(request, response){
    
    const version = request.configuration.version;
    const value = {
        'version':version
    }
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(value));
    
})
module.exports = router;