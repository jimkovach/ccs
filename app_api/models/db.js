var flString = "APP_API/MODELS/DB.JS: ";

var mongoose = require('mongoose');
var gracefulShutdown;

switch(process.env.NODE_ENV){
case "production":
    dbURL = "mongodb://jimkovach:gabby@ds053428.mlab.com:53428/ccs";
    break;
case "heroku_development":
    dbURL = "mongodb://jimkovach:gabby@ds053428.mlab.com:53428/ccs";
    break;
default:
    dbURL = "mongodb://localhost:27017/ccs";
    break
}

console.log(flString + "process.env.NODE_ENV: " + process.env.NODE_ENV);
console.log(flString + "dbURL: " + dbURL);

var retry = null;
mongoose.connect(dbURL);

mongoose.connection.on('connected', function(){
    console.log('Mongoose connected to ' + dbURL);
});

mongoose.connection.on('error', function(err){
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function(){
    console.log('Mongoose disconnected');
});

gracefulShutdown = function(msg, callback){
    mongoose.connection.close(function(){
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

// for nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});

//for app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});

//for Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function() {
        process.exit(0);
    });
});

require('./dataSchema.js');
require('./exhibitSchema.js');
require('./users.js');
require('./sponsorSchema.js');
require('./instrumentSchema.js');
