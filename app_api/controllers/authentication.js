console.log("APP_API/CONTROLLERS/AUTHENTICATION.JS");
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJsonResponse = function(res, status, content){
    res.status(status);
    res.json(content);
};

module.exports.register = function(req, res) {
    console.log("APP_API/CONTROLLERS/AUTHENTICATION.JS MODULE.EXPORTS.REGISTER");
    if(!req.body.name || !req.body.email || !req.body.password) {
        sendJsonResponse(res, 400, {
            "message" : "All fields required"
        });
        return;
    }
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(function(err) {
        var token;
        if(err) {
            sendJsonResponse(res, 404, err);
        } else {
            token = user.generateJwt();
            sendJsonResponse(res, 200, {
                "token" : token
            });
        }
    });
};

module.exports.login = function(req, res) {
    console.log("APP_API/CONTROLLERS/AUTHENTICATION.JS MODULE.EXPORTS.LOGIN");
    if(!req.body.email || !req.body.password) {
        sendJsonResponse(res, 400, {
            "message" : "All fields required"
        });
        return;
    }
    passport.authnticate('local', function(err, user, info) {
        console.log("APP_API/CONTROLLERS/AUTHENTICATION.JS MODULE.EXPORTS.LOGIN PASSPORT.AUTHENTICATE");
        var token;
        if (err) {
            sendJsonResponse(res, 404, err);
            return;
        }
        if(user) {
            token = user.generateJwt();
            sendJsonResponse(res, 200, {
                "token" : token
            });
        } else {
            sendJsonResponse(res, 401, info);
        }
    }) (req, res);
};
