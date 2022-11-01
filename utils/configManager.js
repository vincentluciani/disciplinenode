const yaml_config = require('node-yaml-config');
var path = require('path');

const getApplicationConfiguration = () => {
    const currentEnvironment = process.env.NODE_ENV
    const environmentFile = path.resolve(__dirname, '..') + '/config/config_'+ process.env.NODE_ENV +'.js'

    const environmentConfiguration = require(environmentFile)
    
    return environmentConfiguration  
}

module.exports = {
    getApplicationConfiguration: getApplicationConfiguration
}
   