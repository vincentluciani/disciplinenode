const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var compression = require('compression')
const logManager = require('./logManager.js');
const configManager = require('./configManager.js')
var fs = require('fs');
const mongoStoreFactory = require('connect-mongo');

const app = express();
const http = require('http');
const https = require('https');
const options = {}

const initializeServer = (routers,protocol) => {

    const configuration = configManager.getApplicationConfiguration();

    var lm = new logManager(configuration.logDirectory);
    lm.logger.info("Environment:"+process.env.NODE_ENV)

    mongoose.connect(configuration.database,{ useNewUrlParser: true, useUnifiedTopology: true, family: 4 })
    .then(()=> {
            console.log('Mongodb connected')
            lm.logger.info("Mongodb connected")
        }
        )
    .catch(err => console.log(err));

    let httpServer

    if (protocol === 'http'){       
        httpServer = http.createServer(options,app);
    } else {
        var key = configuration.privateKey;
        var cert = configuration.certificate;
        var bundle = configuration.bundle

        var keyFile = fs.readFileSync(key);
        var certFile = fs.readFileSync(cert);
        var bundleFile;
        var options;

        if ( null !== bundle && bundle != "" && bundle)
        {
        bundleFile = fs.readFileSync(bundle);  
        options = {
            key: keyFile,
            ca: bundleFile,
            cert: certFile
        };
        }
        else {
        options = {
            key: keyFile,
            cert: certFile
        };
        }

        httpServer = https.createServer(options,app);
    }
    const port = process.env.PORT ||  5000;

    // Parse URL-encoded bodies (as sent by HTML forms)
    //app.use(express.urlencoded());

    // Parse JSON bodies (as sent by API clients)
    app.use(express.json());
    app.use(compression())

    // Global variables
    app.use(function(req,res,next){
        req.lm = lm;
        next();
    })

    routers.forEach((item,index) => {
        app.use(item.path,item.router);
    })

    httpServer.listen(port,() => {
        console.log(`Server started on port ${port}`);
    });
}

module.exports = {
    initializeServer: initializeServer
}
         