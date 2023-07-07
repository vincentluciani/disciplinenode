var winston = require('winston');

class logManager {
  constructor(logDirectory) {
    this.logger = new (winston.createLogger)({
      transports: [
        new (winston.transports.Console)({ json: false, timestamp: true }),
        new winston.transports.File({ filename: logDirectory + '/debug.log', json: false })
      ],
      /* __dirname*/
      exceptionHandlers: [
        new (winston.transports.Console)({ json: false, timestamp: true }),
        new winston.transports.File({ filename: logDirectory + '/exceptions.log', json: false, eol:'\r\n' })
      ],
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      exitOnError: false
    });
    var environment = process.env.NODE_ENV;
    if (environment == 'production') {
      this.logger.level = 'error';
    }
    else if (environment == 'development') {
      this.logger.level = 'debug';
    }
  }
}

module.exports = logManager;