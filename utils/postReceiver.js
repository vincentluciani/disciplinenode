const postReceiver = (request,response,next) => {

    var body = ''
    request.on('data', function(data) {
      body += data
      request.lm.logger.info('Partial body: ' + body)
    })
    request.on('end', function() {
      if (null!=request.configuration.pwaTest && request.configuration.pwaTest == 'true'){
        cookieOptionsStart = {
          secure: 'false',
          sameSite: 'None',
        }
      } else {
        cookieOptionsStart = {
          httpOnly : 'true',
          secure: 'true',
          sameSite: 'strict',
        }
         
      }
      request.body = body
      request.cookieOptions = {
        ...cookieOptionsStart,
       
       credentials:'true',
    /* domain: '.app.localhost',*/
      maxAge: 24 * 60 * 60 * 1000 ,
    path:'/' }
      next()
    })

}

module.exports = postReceiver