const callServiceAndAnswer = (serviceFunction,inputObject,response,request) => {
    serviceFunction(inputObject).
    then(value => {
        //let result = {"result":value};
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(value));
        console.log(value);
        }, reason => {
            response.statusCode = 500;
            response.send('Error Processing Your Request');
            request.lm.logger.error('Error Processing the Request:'+  request.originalUrl)
            request.lm.logger.error(reason.message)
            request.lm.logger.error(reason.stack)
        })
    }

module.exports = {
    callServiceAndAnswer: callServiceAndAnswer
}
      
