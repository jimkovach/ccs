
var flString = "APP_API/CONTROLLERS/CON_EXHIBITS.JS: ";
console.log(flString);

var request = require('request');
var mongoose = require('mongoose');
var Exhibit = mongoose.model('Exhibit');

var sendJsonResponse = function(res, status, content){
    res.status(status);
    res.json(content);
};

/*
module.exports.exhibits = function(req, res){
    var fString = flString + "EXHIBITS: ";
    console.log(fString);
    
};

module.exports.exhibitsReadOne = function(req, res) {
    var fString= flString + "EXHIBITS_READ_ONE: ";
    console.log(fString);

};
*/

module.exports.exhibitsNew = function(req, res) {
    var fString =flString + "EXHIBIT_NEW: ";
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
        creationDate : req.body.creationDate,
        modificationDate : req.body.modificationDate,
        modified : req.body.modified,
        cancelled : req.body.cancelled,
        checked : req.body.checked
    }, function(err, exhibits) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, events);
        }
    });
};

/*
module.exports.exhibitsUpdate = function(req, res) {
    var fString = flString + "EXHIBITS_UPDATE: ";
    console.log(fString);

};

module.exports.exhibitsDelete = function(req, res) {
    var fString = flString + "EXHIBITS_DELETE: ";
    console.log(fString);

};
*/
