var flString = "APP_API/CONTROLLERS/CON_SPONSORS.JS: ";
console.log(flString);

var request = require('request');
var mongoose = require('mongoose');
var utilities = require('../../public/js/utilities.js');
var Sponsor = mongoose.model('Sponsor');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.sponsorsGetAll = function(req, res) {
    var fString = flString + "SPONSORS_GET_ALL: ";
    console.log(fString);
    var findQueryObject = {};
    var findValue = req.query.findvalue;
    var findKey = req.query.findkey;
    if(findValue){
        findQueryObject[findKey] = findValue;
    }
    var sortQuery = req.query.sort;
    console.log(fString + sortQuery);
    var results = [];
    if (findKey != ""){
        Sponsor
            .find(findQueryObject)
            .sort(sortQuery)
            .exec(function(err, sponsors) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, sponsors);
                }
            });
    } else {
        Sponsor
            .find()
            .sort(sortQuery)
            .exec(function(err, sponsors) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, sponsors);
                }
            });
    }
};

module.exports.sponsorsCreate = function(req, res) {
    var fString = flString + "SPONSORS_CREATE: ";
    console.log(fString);
    Sponsor.create({
        sponsor : req.body.sponsor,
        institution : req.body.institution,
        description : req.body.description,
        modified : req.body.modified,
        cancelled : req.body.cancelled,
        checked : req.body.checked
    }, function(err, sponsors) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, sponsors);
        }
    });
};

module.exports.sponsorsReadOne = function(req, res){
    var fString = flString + "SPONSOR_READ: ";
    console.log(fString);
    var sponsorid = req.params.sponsorid;
    console.log(fString + "SPONSORID:: " + sponsorid);
    Sponsor
        .findById(sponsorid)
        .exec(function(err, sponsors) {
            var response = {
                status : 200,
                message : sponsors
            };
            if (err) {
                response.status = 500;
                response.message = err;
            } else if(!sponsors) {
                response.status = 404;
                response.message = {
                    "message" : "Sponsor ID not found"
                };
            }
            sendJsonResponse(res, 200, sponsors);
        });
};

module.exports.sponsorsUpdate = function(req, res) {
    var fString = flString + "SPONSORS_UPDATE: ";
    console.log(fString);
    if(!req.params.sponsorid){
        sendJsonResponse(res, 404, {
            "message" : fString + "Not founde, sponsorid is required"
        });
        return;
    }
    Sponsor
        .findById(req.params.sponsorid)
        .exec(
            function(err, sponsors) {
                if(!sponsors) {
                    sendJsonResponse(res, 404, {
                        "message" : fString + "sponsorid not found"
                    });
                    return;
                }else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                sponsors.sponsor = req.body.sponsor,
                sponsors.institution = req.body.institution,
                sponsors.checked = req.body.checked,
                sponsors.modified = true,
                sponsors.modificationDate = new Date();
                sponsors.save(function(err, sponsors){
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, sponsors);
                    }
                });
            }
        );
};

module.exports.sponsorsDelete = function(req, res) {
    var fString = flString + "SPONSORS_DELETE: ";
    console.log(fString);
    var sponsorid = req.params.sponsorid;
    console.log(fString + "SPONSOR_ID: " + sponsorid);
    if (sponsorid) {
        Sponsor
        .findByIdAndRemove(sponsorid)
        .exec(
            function(err, sponsors) {
                if (err ) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 204, null);
            }
            );
    } else {
       sendJsonResponse(res, 404, {
        "message": "No sponsorid"
    });
   }
};
