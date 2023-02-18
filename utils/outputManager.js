
const outputResults = (request, result, next) => {
    if (result.apiResult.status=="success"){
        handlePositiveResult(result.apiResult.object)
        lm.logger.info("successful api call")
    } else {
        handleNegativeResult();
        lm.logger.error("Error in the api:"+result.apiResult.error)
    }
}

const handlePositiveResult = (resultObject)=>{

    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end(JSON.stringify(resultObject))
}

const handleNegativeResult = () =>{
    response.writeHead(401, {'Content-Type': 'text/html'})
    response.end("Authentication Failed")
}
module.exports = {
    outputResults: outputResults,
    handlePositiveResult: handlePositiveResult,
    handleNegativeResult: handleNegativeResult
}
   