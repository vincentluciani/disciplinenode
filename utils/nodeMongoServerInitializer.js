const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var compression = require('compression')
const logManager = require('./logManager.js');

const mongoStoreFactory = require('connect-mongo');

const app = express();
const https = require('http');
const options = {}

const initializeServer = (routers) => {
    var lm = new logManager('C:\\software\\react-discipline\\logs\\');
    lm.logger.info("Environment:"+process.env.NODE_ENV)

    mongoose.connect('mongodb://127.0.0.1:27017/discipline',{ useNewUrlParser: true, useUnifiedTopology: true, family: 4 })
    .then(()=> {
            console.log('Mongodb connected')
            lm.logger.info("Mongodb connected")
        }
        )
    .catch(err => console.log(err));

    var httpServer = http.createServer(options,app);

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
         