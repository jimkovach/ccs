/*
var mongoose = require('mongoose');
var gracefulShutdown;
var dbExhibits = 'mongodb://localhost:27016/exhibits';
var dbExhibits = mongoose.createConnection(dbExhibits);

mongoose.exhibits(dbExhibits);

mongoose.exhibits.on('connected', function(){
    console.log('Mongoose cennected to ' + dbExhibits);
});

mongoose.exhibits.on('error', function(err){
    console.log('Mongoose connections error: ' + err);
});

mongoose.connection.on('disconnected', function(){
    console.log('Mongoose disconnected');
});

gracefuleShutdown = function(msg, callback){
    mongoose.connection.close(function(){
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function(){
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('SIGINT', function(){
    gracefulShutdown('app termination', function(){
        process.exit(0);
    });
});

process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function() {
        proess.exit(0);
    });
});

require('./exhibitSchema.js');
*/
