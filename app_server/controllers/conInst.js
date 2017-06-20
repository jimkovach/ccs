var flString = "APP_SERVER/CONTROLLERS/CON_INST.JS: ";
console.log(flString);

var fs = require('fs');
var request = require('request');
var PDFDocument = require('pdfkit');

var utilities = require('../../public/js/utilities.js');
var apiOptions = {
    server : 'http://localhost:3000'
};


switch (process.env.NODE_ENV){
case "production":
    apiOptions.server ="http://ccs.herokuapp.com";
    break;
case "heroku_development":
    apiOptions.server = "http://localhost:5000";
    break;
default:
    apiOptions.server = "http://localhost:3000";
    break;
}

/*
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'http://ccs.herokuapp.com';
}
*/

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

// CREATE PDF
var renderPdf = function(req, res, instruments, page, msg) {
    var pdf = new PDFDocument;
    fString = flString + "RENDER_PDF: ";
    var file = 'texts/pdf/' + page + '.pdf';
    var i = 0;
    pdf.pipe(fs.createWriteStream(file));
    pdf.font('Times-Roman');
    pdf.fontSize(32);
    pdf.text(page.toUpperCase(),
             {align : 'center'});
    pdf.moveDown(1);
    var fontSize = 10;
    pdf.fontSize(fontSize);
    for (i in instruments){
        pdf.text('Instrument: ' + instruments[i].instrument + '\n' +
                 'Serial #: ' + instruments[i].serial + '\n' +
                 'Make: ' + instruments[i].make +'\n' +
                 'Model: ' + instruments[i].model + '\n' +
                 'Owner: ' + instruments[i].owner + '\n' +
                 'Group: ' + instruments[i].group + '\n' +
                 'PICKUP' + '\n' +
                 'Building: ' + instruments[i].pickupBuilding + '\n' +
                 'Room: ' + instruments[i].pickupRoom + '\n' +
                 'Date: ' + instruments[i].pickupDate + '\n' +
                 'Time: ' + instruments[i].pickupTime + '\n' +
                 'Manager: ' + instruments[i].pickupPerson + '\n' +
                 'DELIVERY' + '\n' +
                 'Building: ' + instruments[i].deliveryBuilding + '\n' +
                 'Room: ' + instruments[i].deliveryRoom + '\n' +
                 'Date: ' + utilities.dateFromNum(instruments[i].deliveryDate) + '\n' +
                 'Time: ' + instruments[i].deliveryTime + '\n' +
                 'Manager: ' + instruments[i].deliveryPerson + '\n' +
                 'RETURN' + '\n' +
                 'Date: ' + utilities.dateFromNum(instruments[i].returnDate) + '\n' +
                 'Time: ' + instruments[i].returnTime + '\n' +
                 'Manager: ' + instruments[i].returnPerson + '\n' +
                 'Modified: ' + instruments[i].modificationDate,
                 {width:500,
                  height:fontSize * 7,
                  columns : 4});
        pdf.moveDown(1);
        }            
    pdf.end();
};

// CREATE TEXT FILES
var renderText = function(req, res, instruments, page, msg, type) {
    fString = flString + "RENDER_TEXT: ";
    var message;
    var delimiter, postfix;
    var file;
    var i = 0;
    var instrument_string = '';
    switch(type){
    case 'tab':
        delimiter = '\t';
        postfix = 'tab';
        break;
    case 'comma':
        delimiter = ',';
        postfix = 'csv';
        break;
    case 'line':
        delimiter = '\n';
        postfix = 'lb_txt';
        break;
    case 'pdf':
        renderPdf(req, res, instruments, page, msg);
        break;
    default:
        delimiter = ' ';
        postfix = 'txt';
    }
    file = 'texts/' + postfix + "/" + page + "." + postfix;
    if(type === 'comma'){
        instrument_string =
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            'PICKUP' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            'DELIVERY' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            'RETURN' +
            '\n' +
            'INSTRUMENT' + delimiter +
            'SERIAL #' + delimiter +
            'MAKE' + delimiter +
            'MODEL' + delimiter +
            'OWNER' + delimiter +
            'GROUP' + delimiter +
            'BUILDING' + delimiter +
            'ROOM' + delimiter +
            'DATE' + delimiter +
            'TIME' + delimiter +
            'MANAGER' + delimiter +
            'BUILDING' + delimiter +
            'ROOM' + delimiter +
            'DATE' + delimiter +
            'TIME' + delimiter +
            'MANAGER' + delimiter +
            'DATE' + delimiter +
            'TIME' + delimiter +
            'MANAGER' +
            '\n';
    }
    for(i in instruments){
        instrument_string +=
            instruments[i].instrument + delimiter +
            instruments[i].serial + delimiter +
            instruments[i].make + delimiter +
            instruments[i].model + delimiter +
            instruments[i].owner + delimiter +
            instruments[i].group + delimiter +
            instruments[i].pickupBuilding + delimiter +
            instruments[i].pickupRoom + delimiter +
            utilities.dateFromNum(instruments[i].pickupDate) + delimiter +
            instruments[i].pickupTime + delimiter +
            instruments[i].pickupPerson + delimiter +
            instruments[i].deliveryBuilding + delimiter +
            instruments[i].deliveryRoom + delimiter +
            utilities.dateFromNum(instruments[i].deliveryDate) + delimiter +
            instruments[i].deliveryTime + delimiter +
            instruments[i].deliveryPerson + delimiter +
            utilities.dateFromNum(instruments[i].returnDate) + delimiter +
            instruments[i].returnTime + delimiter +
            instruments[i].returnPerson + delimiter +
            instruments[i].modificationDate + delimiter +
            instruments[i].cancelled +
            '\n';
    }
    fs.writeFile(file, instrument_string, function(err) {
        if (err) {
            return console.error(fString + 'ER: ' + err);
        } else {
        }
    });
};

var renderInstruments = function(req, res, instruments, page, msg, title) {
    fString = flString + "RENDER_INSTRUMENT: ";

    var message;
    var textArray = ['txt', 'tab', 'comma', 'line', 'pdf'];
        if(!title){
            title = page;
    }
    if(!title){
        title = page;
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

    res.render(page, {
        title: page,
        pageHeader: {
            title: title.toUpperCase(),
            strapline: 'select a title to find details on that specific event. select a table header to sort by that item.'
        },
        instruments : instruments,
        message : message
    });
    for(var i = 0; i < textArray.length; i++) {
        renderText(req, res, instruments, page, msg, textArray[i]);
    }
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
                renderInstruments(req, res, body, page, message, title);
            } else {
                console.log(fString + "REQUEST STATUS: " + response.statusCode);
            }
        }
    );
};

var renderInstrumentPage = function (req, res, page, instrument) {
    var fString = flString + "RENDER_INSTRUMENT_PAGE ";
    res.render(page, {
        title: instrument.instrument,
        pageHeader: {title : "INSTRUMENTS: " + instrument.instrument + " #" + instrument.serial},
        instrument : instrument
    });
};

module.exports.instrumentRead = function (req, res){
    var fString = flString + "INSTRUMENT_READ: ";
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
//        pickup : req.body.pickup,
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
            if (response.statusCode === 200 || response.statusCode === 201){
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
//        pickup : utilities.convertToDate(req.body.pickup),
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
        modified : true,
        modificationDate : Date.now
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postData,
        qs : {}
    };
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
                res.redirect('/instruments');
            } else {
                _showError(req, res, response.statusCode);
                console.log(fString + "DELETE ERROR: " + err);
            }
        }
    );
};
