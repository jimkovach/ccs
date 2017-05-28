var flString = "APP_API/CONTROLLERS/CON_INSTRUMENTS.JS: ";
console.log(flString);

var request = require('request');
var mongoose = require('mongoose');
var Instrument = mongoose.model('Instrument');

var sendJsonResponse = function(res, status, content){
    res.status(status);
    res.json(content);
};

module.exports.instrumentsCreate = function(req, res) {
    var fString = flString + "INSTRUMENTS_CREATE: ";
    console.log(fString);
    Instrument.create({
        instrument : req.body.instrument,
        serial : req.body.serial,
        make : req.body.make,
        model : req.body.model,
        group : req.body.group,
        owner : req.body.owner,
//        pickup : req.body.pickupDate + " " + req.body.pickupTime
        pickupBuilding : req.body.pickupBuilding,
        pickupRoom : req.body.pickupRoom,
        pickupDate : req.body.pickupDate,
        pickupTime : req.body.pickupTime,
        pickupPerson : req.body.pickupPerson,
        deliveryBuilding : req.body.deliverBuilding,
        deliveryRoom : req.body.deliveryRoom,
        deliveryDate : req.body.deliveryDate,
        deliveryTime : req.body.deliveryTime,
        deliveryPerson : req.body.deliveryPerson,
        returnDate : req.body.returnDate,
        returnTime : req.body.returnTime,
        returnPerson : req.body.returnPerson,
        modified : req.body.modified,
        cancelled : req.body.cancelled,
        checked : req.body.checked
    }, function(err, instruments) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, instruments);
        }
    });
};

module.exports.instrumentsReadAll = function(req, res) {
    var fString = flString + "INSTRUMENTS_READ_ALL: ";
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
        Instrument
            .find(findQueryObject)
            .sort(sortQuery)
            .exec(function(err, instruments) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, instruments);
                }
            });
    } else {
        Instrument
            .find()
            .sort(sortQuery)
            .exec(function(err, instruments) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, instruments);
                }
            });
    }
};

module.exports.instrumentsRead = function (req, res) {
    var fString = flString + "INSTRUMENTS_READ";
    console.log(fString);
    var instrumentid = req.params.instrumentid;
    Instrument
        .findById(instrumentid)
        .exec(function(err, instruments){
            var response = {
                status : 200,
                message : instruments
            };
            if (err) {
                response.status = 500;
                response.message = err;
            } else if(!instruments) {
                response.status = 404;
                response.message = {
                    "message" : fString + "Instrument Id not found"
                };
            }
            sendJsonResponse(res, 200, instruments);
        });
};

module.exports.instrumentsUpdate = function(req, res) {
    var fString = flString + "INSTRUMENTS_UPDATE: ";
    console.log(fString);
    if(!req.params.instrumentid){
        sendJsonResponse(res, 404, {
            "message" : fString + "Not founde, instrumentid is required"
        });
        return;
    }
    Instrument
        .findById(req.params.instrumentid)
        .exec(
            function(err, instruments) {
                if(!instruments) {
                    sendJsonResponse(res, 404, {
                        "message" : fString + "instrumentid not found"
                    });
                    return;
                }else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                instruments.instrument = req.body.instrument,
                instruments.serial = req.body.serial,
                instruments.make = req.body.make,
                instruments.model = req.body.model,
                instruments.owner = req.body.owner,
                instruments.group = req.body.group,
                instruments.pickupBuilding = req.body.pickupBuilding,
                instruments.pickupRoom = req.body.pickupRoom,
                instruments.pickupDate = req.body.pickupDate,
                instruments.pickupTime = req.body.pickupTime,
                instruments.pickupPerson = req.body.pickupPerson,
                instruments.deliveryBuilding = req.body.deliveryBuilding,
                instruments.deliveryRoom = req.body.deliveryRoom,
                instruments.deliveryDate = req.body.deliveryDate,
                instruments.deliveryTime = req.body.deliveryTime,
                instruments.deliveryPerson = req.body.deliveryPerson,
                instruments.returnDate = req.body.returnDate,
                instruments.returnTime = req.body.returnTime,
                instruments.returnPerson = req.body.returnPerson,
                instruments.checked = req.body.checked,
                instruments.modified = req.body.modified,
                instruments.modificationDate = req.body.modificationDate;
                instruments.save(function(err, instruments){
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, instruments);
                    }
                });
            }
        );
};

module.exports.instrumentsDelete = function(req, res) {
    var fString = flString + "INSTRUMENTS_DELETE: ";
    console.log(fString);
    var instrumentid = req.params.instrumentid;
    console.log(fString + "INSTRUMENT_ID: " + instrumentid);
    if (instrumentid) {
        Instrument
        .findByIdAndRemove(instrumentid)
        .exec(
            function(err, instruments) {
                if (err ) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 204, null);
            }
            );
    } else {
       sendJsonResponse(res, 404, {
        "message": "No instrumentid"
    });
   }
};
