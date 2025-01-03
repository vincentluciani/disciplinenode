const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var compression = require('compression')
const logManager = require('./logManager.js');
const configManager = require('./configManager.js')
var fs = require('fs');
const mongoStoreFactory = require('connect-mongo');
const postReceiver = require('../utils/postReceiver.js')
const authenticationManager = require('../utils/authenticationManager.js')
const authRouter= require('./auth');
const subscriptionRouter = require('./subscriptions/router.js');
const versionRouter = require('./version')
const cors = require('cors');

const app = express();
const cookieParser = require('cookie-parser');
const http = require('http');
const https = require('https');
const options = {}

const initializeServer = routers => {

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

    if (null!=configuration.pwaTest && configuration.pwaTest == 'true'){       
        httpServer = http.createServer(options,app);

        app.use(cors({
            origin: configuration.pwaTestURL, // Allow requests from this origin
            credentials: true // Allow credentials (cookies) to be sent
          }));
        app.use(function(req, res, next) {
            res.header('Referrer-Policy', 'unsafe-url');
            res.header("Access-Control-Allow-Origin", configuration.pwaTestURL);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header("Access-Control-Allow-Credentials", 'true');
            next();
        });
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
    const port = process.env.PORT ||  5001;

    // Parse URL-encoded bodies (as sent by HTML forms)
    //app.use(express.urlencoded());

    // Parse JSON bodies (as sent by API clients)
    app.use(express.json());
    app.use(compression())

    // Use cookie-parser middleware to parse cookies
    app.use(cookieParser());

    // Global variables
    app.use(function(req,res,next){
        req.lm = lm;
        req.configuration = configuration
        req.mongoose = mongoose
        next();
    })

    routers.forEach((item,index) => {
        app.use(item.path,item.router);
    })

    app.use('/auth',authRouter);
    app.use('/subscription',subscriptionRouter);
    app.use('/version',versionRouter);

    httpServer.listen(port,() => {
        console.log(`Server started on port ${port}`);
    });
}

module.exports = {
    initializeServer: initializeServer
}
         