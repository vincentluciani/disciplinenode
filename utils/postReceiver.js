const receivePostRequest = async request => {

    var body = ''
    request.on('data', function(data) {
      body += data
      console.log('Partial body: ' + body)
    })
    request.on('end', function() {
      return body
    })

}

module.exports = receivePostRequest