var flString = "APP_API/CONTROLLERS/CON_EXHIBITS.JS: ";
console.log(flString);

var request = require('request');
var mongoose = require('mongoose');
var Exhibit = mongoose.model('Exhibit');

var sendJsonResponse = function(res, status, content){
    res.status(status);
    res.json(content);
};


module.exports.exhibitsGetAll = function(req, res){
    var fString = flString + "EXHIBITS_GET_ALL: ";
    console.log(fString);
    var findQueryObject = {};
    var findValue = req.query.findvalue;
    var findKey = req.query.findkey;
    if(findValue){
        findQueryObject[findKey] = findValue;
    }
    var sortQuery = req.query.sort;
    var results = [];
    if (findKey != ""){
        Exhibit
        .find(findQueryObject)
        .sort(sortQuery)
        .exec(function(err, exhibits) {
            if (err) {
                sendJsonResponse(res, 404, err);
            } else {
                sendJsonResponse(res, 200, exhibits);
            }
        });
    } else {
        Exhibit
            .find()
            .sort(sortQuery)
            .exec(function(err, exhibits) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, exhibits);
                }
            });
    }
    
};

module.exports.exhibitorsReadAll = function(req, res) {
    var fString = flString + "EXHIBITORS_READ_ALL: ";
    console.log(fString);
    var sortQuery = req.query.sort;
    var findQuery = req.query.find;
    var results = [];
    Exhibit
        .find(findQuery)
        .sort(sortQuery)
        .exec(function(err, exhibits) {
            if (err) {
                sendJsonResponse(res, 404, err);
            } else {
                sendJsonResponse(res, 200, exhibits);
            }
        });
};
module.exports.exhibitsReadOne = function(req, res) {
    var fString = flString + "EXHIBITS_READ_ONE: ";
    console.log(fString);
    var exhibitid = req.params.exhibitid;
    console.log(fString + "EXHIBITID: " + exhibitid);
    Exhibit
        .findById(exhibitid)
        .exec(function(err, exhibits) {
            var response = {
                status : 200,
                message : exhibits
            };
            if (err) {
                response.status = 500;
                response.message = err;
            } else if(!exhibits) {
                response.status = 404;
                response.message = {
                    "message" : "Exhibit ID not found"
                };
            }
            sendJsonResponse(res, 200, exhibits);
        });

};

module.exports.exhibitsCreate = function(req, res) {
    var fString = flString + "EXHIBITS_CREATE: ";
    console.log(fString);

    Exhibit.create({
        exhibit : req.body.exhibit,
        booth : req.body.booth,
        exhibitor : req.body.exhibitor,
        title : req.body.title,
        address : req.body.address,
        city : req.body.city,
        state : req.body.state,
        zip : req.body.zip,
        email : req.body.email,
        phone : req.body.phone,
        web : req.body.web,
        description : req.body.description,
        modified : req.body.modified,
        cancelled : req.body.cancelled,
        checked : req.body.checked
    }, function(err, exhibits) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, exhibits);
        }
    });
};


module.exports.exhibitsUpdate = function(req, res) {
    var fString = flString + "EXHIBITS_UPDATE: ";
    console.log(fString);
    if(!req.params.exhibitid){
        console.log(fString + "NO REQ.PARAMS.EXHIBITID: " + req.params.exhibited);
        sendJsonResponse(res, 404, {
            "message" : fString + "Not found, exhibitsid is required"
        });
        return;
    } 
    Exhibit
    .findById(req.params.exhibitid)
    .exec(
        function(err, exhibits){
            if (!exhibits) {
                console.log(fString + "EXHIBIT ERR: NO EXHIBITS FOUND");
                sendJsonResponse(res, 404, {
                    "message" : fString + "EXHIBITSID NOT FOUND"
                });
                return;
            } else if (err) {
                console.log(fString + "EXHIBIT: ERR: " + err);
                sendJsonResponse(res, 400, err);
                return;
            }
            exhibits.exhibit = req.body.exhibit,
            exhibits.booth = req.body.booth,
            exhibits.exhibitor = req.body.exhibitor,
            exhibits.title = req.body.title,
            exhibits.address = req.body.address,
            exhibits.city = req.body.city,
            exhibits.state = req.body.state,
            exhibits.zip = req.body.zip,
            exhibits.email = req.body.email,
            exhibits.phone = req.body.phone,
            exhibits.web = req.body.web,
            exhibits.description = req.body.description,
            exhibits.modified = true,
            exhibits.modificationDate = new Date();
            exhibits.save(function(err, exhibits) {
                if (err) {
                    console.log(fString + "ERR: " + err);
                    sendJsonResponse(res, 404, err);
                } else {
                    console.log(fString + "Success: " + exhibits.exhibit);
                    sendJsonResponse(res, 200, exhibits);
                }
            });
        }
    );
};

module.exports.exhibitsDelete = function(req, res) {
    var fString = flString + "EXHIBITS_DELETE: ";
    console.log(fString);
    var exhibitid = req.params.exhibitid;
    console.log(fString + "EXHIBIT_ID: " + exhibitid);
    if (exhibitid) {
        Exhibit
        .findByIdAndRemove(exhibitid)
        .exec(
            function(err, exhibits) {
                if (err ) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 204, null);
            }
            );
    } else {
       sendJsonResponse(res, 404, {
        "message": "No exhibitid"
    });
   }
};

module.exports.exhibitsGetConflicts = function(req, res){
    var fString = flString + "EXHIBITS_GET_CONFLICTS: ";
    console.log(fString);
    var sortQuery = req.query.sort;
    var results = [];
        EXhibit
            .find()
            .exec(function(err, exhibits) {
                if (err) {
                    console.log(fString + "ERR: " + err);
                    sendJsonResponse(res, 404, err);
                } else {
                    results = conflicts.showConflicts(exhibits, sortQuery);
                    console.log(fString + "RESLUTS: " + results);
                    sendJsonResponse(res, 200, results);
                }
            });
};