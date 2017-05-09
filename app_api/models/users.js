var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique : true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash : String,
    salt: String
});

userSchema.methods.setPassword = function(password) {
    console.log("APP_API ROUTES USERS.JS USER_SCHEMA.METHODS SET_PASSWORD: PASSWORD: " + password);
    this.salt = crypto.randomBytes(16).toString('hex');
    console.log("APP_API ROUTES USERS.JS USER_SCHEMA.METHODS SET_PASSWORD: THIS.SALT: " + this.salt);
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    console.log("APP_API ROUTES USERS.JS USER_SCHEMA.METHODS SET_PASSWORD: THIS.HASH: " + this.hash);
};

userSchema.methods.validPassword = function(password){
    console.log("APP_API ROUTES USERS.JS USER_SCHEMA.METHODS VALID_PASSWORD PASSWORD: " + password);
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    console.log("APP_API ROUTES USERS.JS USER_SCHEMA.METHODS SET_PASSWORD HASH: " + hash);
    return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
    console.log("APP_API ROUTES USERS.JS USER_SCHEMA.METHODS.GENERATE_JWT: ");
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email : this.email,
        name : this.name,
        exp : parseInt(expiry.getTime() / 1000),
    }, process.env.JWT_SECRET );
};

mongoose.model('User', userSchema, 'users');
