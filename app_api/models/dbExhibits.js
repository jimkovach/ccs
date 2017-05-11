var mongoose = requie('mongoose');
var gracefulShutdown;
var dbEvents = 'mongodb://localhost/exhibits';
var logExhibits = mongoose.createConnection(dbEvents);

mongoose.events(dbEvents);

mongoose.events.on('connected', function(){
    console.log('Mongoose cennected to ' + dbEvents);
});

mongoose.events.on('error', function(err){
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
require('./users.js');
