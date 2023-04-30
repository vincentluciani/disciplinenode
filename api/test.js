const express = require('express')
const router = express.Router()
const TestService = require('../services/TestService')
const common = require('../utils/requestManager')

router.get('/',(request,response)=>{
  common.callServiceAndAnswer(TestService.getTest,{},response,request);
});


module.exports = router;