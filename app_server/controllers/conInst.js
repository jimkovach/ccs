var flString = "APP_SERVER/CONTROLLERS/CON_INST.JS: ";
console.log(flString);

var fs = require('fs');
var request = require('request');
var PDFDocument = require('pdfkit');

var utilities = require('../../public/js/utilities.js');
var apiOptions = {
    server : 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'http://ccs.herokuapp.com';
}

var _showError = function(req, res, status) {
    var fString = (flString + "_SHOWeRROR: ");
    var title, content;
    if (status === 404) {
        title = "404, page not found";
        content = "Oops. Can't find this page.";
    } else if (status === 500) {
        title = "500, internal server error";
        content = "Problem with our server.";
    } else {
        title = status + ", something's gone wrong";
        content = "something, somewhere, has gone just a bit wrong";
    }
    console.log(fString + title + " " + content);
    res.status(status);
    res.render('main', {
        title : title,
        content : content
    });
};

var renderInstruments = function(req, res, instruments, page, msg, title) {
    fString = flString + "RENDER_INSTRUMENT: ";
    console.log(fString);
    var message;
    if(!title){
        title = utilities.toTitleCase(page);
    }
    if(!(instruments instanceof Array)){
        message = "API lookup error: responseBody must be an array";
        instruments = [];
    } else if (!instruments.length) {
        message = "No items found";
    } else {
        if(msg){
            message = msg;
        }
    }
    console.log(fString + "PAGE: " + page);
    res.render(page, {
        title: page,
        pageHeader: {
            title: utilities.toTitleCase(title),
            strapline: 'select a title to find details on that specific event. select a table header to sort by that item.'
        },
        instruments : instruments,
        message : message
    });
};

module.exports.instruments = function (req, res){
    var fString = flString + "INSTRUMENTS: ";
    var requestOptions, path, page, message;
    var sortQuery = "instrument";
    var findvalue = "";
    var findkey = "";
    var title = "Instruments";
    message = "";
    if(!page){
        page = "instruments";
        path = '/api/instruments';
    };
    console.log(fString + req.query.sort);
    if (req.query.sort) {
        sortQuery = req.query.sort;
    }
    if (req.query.findvalue != ""){ 
        findvalue = req.query.findvalue;
        title = findvalue;
    }
    if (req.query.findkey != ""){
        findkey = req.query.findkey;
    }
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {sort : sortQuery,
              findkey : findkey,
              findvalue : findvalue}
    }
    request(    
        requestOptions,
        function(err, response, body) {
            if (err) {
                console.log(fString + "REQUEST ERROR: " + err);
            } else if (response.statusCode === 200) {
                console.log(fString + "RESPONSE.STATUS_CODE: " + response.statusCode);
                renderInstruments(req, res, body, page, message, title);
            } else {
                console.log(fString + "REQUEST STATUS: " + response.statusCode);
            }
        }
    );
};

var renderInstrumentPage = function (req, res, page, instrument) {
    var fString = flString + "RENDER_INSTRUMENT_PAGE ";
    console.log(fString);
    console.log(fString + "PAGE: " + page);
    console.log(fString + "INSTRUMENT: " + instrument + ": " + instrument.instrument);
    res.render(page, {
        title: instrument.instrument,
        pageHeader: {title : instrument.instrument},
        instrument : instrument
    });
};

module.exports.instrumentRead = function (req, res){
    var fString = flString + "INSTRUMENT_READ: ";
    console.log (fString);
    var requestOptions, path, page;
    page="instrument";
    path = "/api/instrumentsRead/" + req.params.instrumentid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request (
        requestOptions,
        function(err, response, body) {
            if(err) {
                console.log(fString + "REQUEST ERR: " + err);
            } else if (response.statusCode === 200) {
                console.log(fString + "REQUEST SUCCESSFUL, RESPONSE: " + response.statusCode);
                renderInstrumentPage(req, res, page, body);
            } else {
                console.log(fString + "REQUEST STATUSE: " + response.statusCode);
            }
        }
    );
};

module.exports.instrumentCreate = function (req, res){
    res.render('instrumentCreate',{
        title : 'New Instrument',
        pageHeader: {
            title: 'Create New Instrument Assignment'
        }
    });
};

module.exports.doInstrumentCreate = function(req, res){
    var fString = flString + "DO_INSTRUMENT_CREATE: ";
    console.log(fString);
    var requestOptions, path, message;
    path = '/api/instrumentsCreate';
    var postData = {
        instrument : req.body.instrument,
        serial : req.body.serial,
        make : req.body.make,
        model : req.body.model,
        owner : req.body.owner,
        group : req.body.group,
        pickupBuilding : req.body.pickupBuilding,
        pickupRoom : req.body.pickupRoom,
        pickup : req.body.pickup,
        pickupDate : req.body.pickupDate,
        pickupTime : req.body.pickupTime,
        pickupPerson : req.body.pickupPerson,
        deliveryBuilding : req.body.deliveryBuilding,
        deliveryRoom : req.body.deliveryRoom,
        deliveryDate : req.body.deliveryDate,
        deliveryTime : req.body.deliveryTime,
        deliveryPerson : req.body.deliveryPerson,
        returnDate : req.body.returnDate,
        returnTime : req.body.returnTime,
        returnPerson : req.body.returnPerson,
        cancelled : req.body.cancelled,
        creationDate : req.body.creationDate,
        checked : req.body.checked,
        modified : false,
        modificationDate : Date.now
    };
    if(!postData.instrument){
        console.log('instrument is required');
        _showError(req, res, 'instrument is required');
        return;
    }
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postData
    };
    request(
        requestOptions,
        function(err, response, body){
            console.log(fString + 'RESPONSE.STATUS_CODE: ' + response.statusCode);
            if (response.statusCode === 200 || response.statusCode === 201){
                console.log(fString + "SUCCESSFULLY POSTED: " + postData.instrument + " WITH A STATUS OF " + response.statusCode);
                message = "Successfully posted " + postData.instrument;
                res.redirect('/instruments');
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

module.exports.instrumentUpdate = function (req, res){
    var fString = flString + "INSTRUMENT_UPDATE: ";
    console.log(fString);
    var requestOptions, path;
    path = "/api/instrumentsRead/" + req.params.instrumentid;
    var page = 'instrumentUpdate';
    console.log(fString + "PATH: " + path);
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {}
    };
    console.log(fString + "REQUEST_OPTIONS.URL: " + requestOptions.url);
    request (
        requestOptions,
        function(err, response, body){
            console.log(fString + "REQUEST FUNCTION ERR: " + err);
            renderInstrumentPage(req, res, page, body);
        }
    );
};

module.exports.doInstrumentUpdate = function(req, res){
    var fString = flString + "DO_INSTRUMENT_UPDATE: ";
    console.log(fString);
    var instrumentid = req.params.instrumentid;
    var requestOptions, path;
    path = "/api/instrumentUpdate/" + instrumentid;
    var postData = {
        instrument : req.body.instrument,
        serial : req.body.serial,
        make : req.body.make,
        model : req.body.model,
        owner : req.body.owner,
        group : req.body.group,
        pickupBuilding : req.body.pickupBuilding,
        pickupRoom : req.body.pickupRoom,
        pickup : utilities.convertToDate(req.body.pickup),
        pickupDate : utilities.convertToDate(req.body.pickupDate),
        pickupTime : req.body.pickupTime,
        pickupPerson : req.body.pickupPerson,
        deliveryBuilding : req.body.deliveryBuilding,
        deliveryRoom : req.body.deliveryRoom,
        deliveryDate : req.body.deliveryDate,
        deliveryTime : req.body.deliveryTime,
        deliveryPerson : req.body.deliveryPerson,
        returnDate : req.body.returnDate,
        returnTime : req.body.returnTime,
        returnPerson : req.body.returnPerson,
        cancelled : req.body.cancelled,
        creationDate : req.body.creationDate,
        checked : req.body.checked,
        modified : true,
        modificationDate : Date.now
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postData,
        qs : {}
    };
    console.log(fString + "REQUEST_OPTIONS.URL: " + requestOptions.url);
    request(
        requestOptions,
        function(err, response, body){
            if (response.statusCode === 200){
                res.redirect('/instrumentRead/' + instrumentid);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

module.exports.instrumentDelete = function(req, res){
    var fString = flString + "INSTRUMENT_DELETE: ";
    console.log(fString);
    var requestOptions, path;
    path = "/api/instrumentsDelete/" + req.params.instrumentid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
        requestOptions,
        function(err, response, body){
            if(response.statusCode === 204){
                console.log(fString + "SUCCESSFULLY DELETED: " + req.params.instrumentid);
                res.redirect('/instruments');
            } else {
                _showError(req, res, response.statusCode);
                console.log(fString + "DELETE ERROR: " + err);
            }
        }
    );
};
