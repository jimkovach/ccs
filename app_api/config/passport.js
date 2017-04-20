console.log("APP_API/CONFIG/PASSPORT.JS");
var passport = require('passport');
console.log("APP_API/CONFIG/PASSPORT.JS AFTER PASSPORT:");
var LocalStrategy = require('passport-local').Strategy;
console.log("APP_API/CONFIG/PASSPORT.JS AFTER LOCAL_STRATEGY");
var mongoose = require('mongoose');
console.log("APP_API/CONFIG/PASSPORT.JS AFTER REQUIRE_MONGOOSE");
var User = mongoose.model('User');
console.log("APP_API/CONFIG/PASSPORT.JS USER: ");

passport.use(new LocalStrategy(
    {usernameField: 'email'},
    function(username, password, done) {
        console.log("APP_API/CONFIG/PASSPORT.JS PASSPORT.USE FUNCTION");
        User.findOne({ email : username }, function (err, user) {
            console.log("APP_API/CONFIG/PASSPORT.JS PASSPORT.USE FUNCTION USER.FIND_ONE");
            if (err) {
                return done(err);}
            if(!user) {
                return done(null, false,{
                    message: 'Incorrect username.'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false,{
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);
        });
    }
));
