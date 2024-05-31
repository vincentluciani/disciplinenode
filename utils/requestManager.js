const callServiceAndAnswer = (serviceFunction,inputObject,response,request) => {
    serviceFunction(inputObject,request.lm.logger,request.configuration['cypheringKey']).
    then(value => {
        response.setHeader('Content-Type', 'application/json');
        /*response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');*/
        response.end(JSON.stringify(value));
        //request.lm.logger.info(value);
        }, reason => {
            response.statusCode = 500;
            response.send('Error Processing Your Request');
            request.lm.logger.error('Error Processing the Request:'+  request.originalUrl)
            request.lm.logger.error(request.body)
            request.lm.logger.error(reason.message)
            request.lm.logger.error(reason.stack)
        })
    }

module.exports = {
    callServiceAndAnswer: callServiceAndAnswer
}
      
