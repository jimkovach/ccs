var mongoose = require('mongoose');
var gracefulShutdown;
var dbURL = 'mongodb://localhost:27017/ccs';
var dbExhibits = 'mongodb://localhost:27018/exhibits';

if (process.env.NODE_ENV === 'production') {
    dbURL = 'mongodb://';
}
var retry = null;
mongoose.connect(dbURL);
//var db_exhibits = mongoose.createConnection(dbExhibits);

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
