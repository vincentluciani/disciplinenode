const postReceiver = (request,response,next) => {

    var body = ''
    request.on('data', function(data) {
      body += data
      request.lm.logger.info('Partial body: ' + body)
    })
    request.on('end', function() {
      request.body = body
      next()
    })

}

module.exports = postReceiver