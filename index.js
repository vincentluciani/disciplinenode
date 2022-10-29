const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const mongoStoreFactory = require('connect-mongo');

const app = express();
const https = require('http');
const options = {}

const habitRouters= require('./routers/habitRouters');
const progressRouters= require('./routers/progressRouters');

mongoose.connect('mongodb://127.0.0.1:27017/discipline',{ useNewUrlParser: true, useUnifiedTopology: true, family: 4 })
.then(()=> console.log('Mongodb connected'))
.catch(err => console.log(err));

var httpServer = http.createServer(options,app);

const port = process.env.PORT ||  5000;

// Parse URL-encoded bodies (as sent by HTML forms)
//app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use('/habits',habitRouters);
app.use('/progress',progressRouters);

httpServer.listen(port,() => {
    console.log(`Server started on port ${port}`);
});