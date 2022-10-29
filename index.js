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

/* https://stackoverflow.com/questions/69840504/mongooseserverselectionerror-connect-econnrefused-127017 */

/*
const uri = 'mongodb://localhost:27017/test';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}

const connectWithDB = () => {
    mongoose.connect(uri, options, (err, db) => {
      if (err) console.error(err);
      else console.log("database connection")
    })
}

connectWithDB()

https://stackoverflow.com/questions/46523321/mongoerror-connect-econnrefused-127-0-0-127017

*/
mongoose.connect('mongodb://localhost:27010/discipline',{ useNewUrlParser: true, useUnifiedTopology: true, family: 4 })
.then(()=> console.log('Mongodb connected'))
.catch(err => console.log(err));

var httpServer = http.createServer(options,app);

const port = process.env.PORT ||  5000;

app.use('/habits',habitRouters);
app.use('/progress',progressRouters);

httpServer.listen(port,() => {
    console.log(`Server started on port ${port}`);
});