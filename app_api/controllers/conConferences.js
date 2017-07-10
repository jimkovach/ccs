var flString = "APP_API/CONTROLLERS/CON_CONFERENCES.JS: ";
console.log(flString);

var request = require("request");
var mongoose = require("mongoose");
var Conference = mongoose.model("Conference");

var sendJsonResponse = function(res, status, content){
    res.status(status);
    res.json(content);
};

module.exports.ccsReadOne = function(req, res) {
    var fString = flString + "ccsReadOne: ";
    console.log(fString);
    var conferenceid = req.params.conferenceid;
    console.log(fString + "conferenceid: " + conferenceid);
    
    Conference
        .findById(conferenceid)
        .exec(function(err, conferences){
            var response = {
                status : 200,
            };
            if (err) {
                response.status = 500;
                response.message = err;
            } else if (!conferences) {
                response.status = 404;
                response.message = {
                    "message" : "CCS ID not found"
                };
            }
            sendJsonResponse(res, 200, conferences);
        });
        console.log(fString + "response.status: " + response.status);

};

module.exports.ccsReadAll = function(req, res){
    var fString = flString + "CCS_READ_ALL: ";
    console.log(fString);
    var findQueryObject = {};
    var findValue = req.query.findvalue;
    var findKey = req.query.findkey;
    if(findValue){
        findQueryObject[findKey] = findValue;
    }
    var sortQuery = req.query.sort;
    var results = [];
    console.log(fString + "findKey: " + findKey);
    if (findKey != ""){
        Conference
            .find(findQueryObject)
            .sort(sortQuery)
            .exec(function(err, conferences){
                if(err){
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, conferences);
                }
            });
    } else {
        Conference
            .find()
            .sort(sortQuery)
            .exec(function(err, conferences){
                if(err){
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, conferences);
                }
            });
    }
};
    
module.exports.ccsCreate = function(req, res){
    var fString = flString + "CCS_CREATE: ";
    console.log(fString);
    Conference.create({
        year : req.body.year,
        title : req.body.title,
        institution : req.body.institution
    }, function(err, conferences){
        if (err) {
            console.log(fString + err);
            sendJsonResponse(res, 400, err);
        } else {
            console.log(fString + "SUCCESSFUL CREATIONS");
            sendJsonResponse(res, 201, conferences);
        }
    });
};

module.exports.conferencesUpdate = function (req, res) {
    var fString = flString + "conferencesUpdate: ";
    console.log(fString);
    if(!req.params.conferenceid){
        console.log(fString + "NO REQ.PARAMS.CONFERENCEID: " + req.params.conferencid);
        sendJsonResponse(res, 404, {
            "message" : fString + "not found, conferenceid is required"
        });
        return;
    }
    Conference
        .findById(req.params.conferenceid)
        .exec(
            function(err, conferences){
                if(!conferences) {
                    console.log(fString + "CCS ERR: NO CONFERENCES FOUND");
                    sendJsonResponse(res, 404, {
                        "message" : fString + "COONFERENCEID NOT FOUND"
                    });
                    return;
                }
                else if (err) {
                    console.log(fString + "CCS ERR: " + err);
                    sendJsonResponse(res, 400, err);
                    return;
                }
                conferences.year = req.body.year,
                conferences.title = req.body.title,
                conferences.institution = req.body.institution,
                conferences.modified = true,
                conferences.modificationDate = new Date();
                conferences.save(function(err, conferences){
                    if (err) {
                        console.log(fString + "ERR: " + err);
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, conferences);
                    }
                });
            }
        );
};

module.exports.conferencesDelete = function(req, res){
    var fString = flString + "CONFERENCES_DELETE: ";
    console.log(fString);
    var conferenceid = req.params.conferenceid;
    console.log(fString + "conferenceid: " + conferenceid);
    if(conferenceid){
        Conference
            .findByIdAndRemove(conferenceid)
            .exec(
                function(err, conferences){
                    if(err){
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonRespons(res, 404, {
            "message": "No conferenceid"
        });
    }
};
