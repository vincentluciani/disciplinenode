const express = require('express');
const router = express.Router();


router.get('/',(req,res)=>{
    let result = {"result":2};
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
}
)  

module.exports = router;