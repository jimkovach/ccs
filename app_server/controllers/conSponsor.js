var flString = "APP_SERVER/CONTROLLERS/CON_SPONSOR.JS ";
var fs = require('fs');
var request = require('request');
var PDFDocument = require('pdfkit');
var pdf = new PDFDocument;
var utilities = require('../../public/js/utilities.js');
var apiOptions = {
    server : "http://localhost:3000"
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
    res.render('error', {
        title : title,
        content : content
    });
};

// CREATE PDF
var renderPdf = function(req, res, sponsors, page, msg) {
    var pdf = new PDFDocument;
    fString = flString + "RENDER_PDF: ";
    var file = 'texts/pdf/' + page + '.pdf';
    var currentInstitution = '';
    var oldInstitution = '';
    var i = 0;
    pdf.pipe(fs.createWriteStream(file));
    pdf.font('Times-Roman');
    pdf.fontSize(32);
    pdf.text(page.toUpperCase(),
             {align : 'center'});
    pdf.moveDown(1);
    for(i in sponsors){
        currentInstitution = sponsors[i].institution;
        if( currentInstitution != oldInstitution){
            pdf.moveDown(1);
            pdf.fontSize(16);
            pdf.text(sponsors[i].institution,
                {
                    width : 300,
                    continued : 'yes'
                });
            oldInstitution = currentInstitution;
            pdf.fontSize(11);
        }
        pdf.text(sponsors[i].sponsor,
            {paragraphGap: 2}
            );
    }
    pdf.end();
};

// CREATE TEXT FILES
var renderText = function(req, res, sponsors, page, msg, type) {
    fString = flString + "RENDER_TEXT: ";
    var message;
    var delimiter, postfix;
    var file;
    var i = 0;
    var sponsor_string = '';
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
        renderPdf(req, res, sponsors, page, msg);
        break;
    case 'txt':
        delimiter = ' ';
        postfix = 'txt';
        break;
    default:
        console.log(fString + "UNDEFINED FILETYPE");
        return;
    }
    if (! type == ".pdf"){
        file = 'texts/' + postfix + "/" + page + "." + postfix;
        for(i in sponsors){
            sponsor_string +=
                sponsors[i].sponsor + delimiter +
                sponsors[i].institution +
                '\n';
        }
        fs.writeFile(file, sponsor_string, function(err) {
            if (err){
                return console.error(fString + 'ERR: ' + err);
            }
        });
    }         
};

var renderSponsorList = function(req, res, sponsors, page, msg, title){
    fString = flString + "RENDER_SPONSOR_LIST: ";
    var message;
    var strapline = "Partners in Promoting Music Education";
    var textArray = ['txt', 'tab', 'comma', 'line', 'pdf'];
    if(!title){
        title = "";
    }
    if(req.query.findkey == "institution"){
        title = title;
        if(req.query.findvalue == "NAfME Corporate Members") {
            strapline = "NAfME corporate members provide vital support for NAfME programs and assist in the continuing efforts to increase awarness of music education in our nation's schools.";
}
    }
    if(!(sponsors instanceof Array)){
        message = "API lookup error: responseBody must be an array";
        sponsors = [];
    } else if (!sponsors.length) {
        message = "No items found";
    } else {
        if(msg) {
            message = msg;
        }
    }
    res.render(page, {
        title: title,
        pageHeader: {
            title: title,
            strapline: strapline
        },
        sponsors : sponsors,
        message : message
    });
    for(var i = 0; i < textArray.length; i++) {
        renderText(req, res, sponsors, page, msg, textArray[i]);
    }
};

module.exports.sponsors = function (req, res) {
    var fString = flString + "SPONSORS: ";
    var requestOptions, path, page, message;
    var sortQuery = 'sponsor';
    var findvalue = "";
    var findkey = "";
    var title = "";
    page = "sponsors";
    path = '/api/sponsors';
    if (req.query.sortb) {
        sortQuery = (req.query.sort, req.query.sortb);
    } else {
        if (req.query.sort) {
            sortQuery = req.query.sort;
        }
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
                console.log(fString + "LIST REQUEST ERROR: " + err);
            } else if (response.statusCode === 200) {
                renderSponsorList(req, res, body, page, message, title);
            } else {
                console.log(fString + "LIST REQUEST STATUS: " + response.statusCode);
            }
        }
    );
};

var renderSponsorPage = function (req, res, page, sponsor) {
    var fString = flString + "RENDER_SPONSOR_PAGE: ";
    res.render(page, {
        title: sponsor.sponsor,
        pageHeader: {title : "SPONSORS: " + sponsor.sponsor},
        sponsor : sponsor
    });
};

module.exports.sponsorCreate = function(req, res){
    var fString = flString + "SPONSOR_CREATE: ";
    var page = "sponsorNew";
    res.render(page, {
        title: 'CCS - New Sponsor',
        pageHeader : {
            title : 'Create New Sponsor',
            strapline : 'note: the sponsor name is required'
        },
    });
};

module.exports.doSponsorCreate = function(req, res){
    var fString = flString + "DO_SPONSOR_CREATE: ";
    var page = "sponsorNew";
    var requestOptions, path, message;
    path = "/api/sponsorsCreate";
    var postData = {
        sponsor : req.body.sponsor,
        institution : req.body.institution,
        creationDate : req.body.creationDate,
        modificationDate : req.body.modificationDate,
        cancelled : req.body.cancelled,
        checked : req.body.checked
    };
    if(!postData.sponsor){
        console.log("sponsor name is required");
        _showError(req, res, "sponsor name is required");
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
            if(response.statusCode === 200) {
                message = fString + "Successfully posted " + postData.sponsor;
                res.redirect('/sponsors');
            } else if (response.statusCode === 201) {
                message = "Successfully posted " + postData.sponsor;
                res.redirect('/sponsors');
            }else{
                _showError(req, res, response.statusCode);
            }
        }
    );
};

module.exports.sponsorRead = function(req, res){
    var fString = flString + "SPONSOR_READ: ";
    var requestOptions, path, page;
    page = "sponsor.pug";
    path = "/api/sponsorsRead/" + req.params.sponsorid;
    var findQuery = "";
    if(req.query.find){
        findQuery = req.query.find
    }
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {find : findQuery}
    };
    request (
        requestOptions,
        function(err, response, body) {
            if(err) {
                console.log(fString + "REQUEST ERR: " + err);
            } else if (response.statusCode === 200) {
                renderSponsorPage(req, res, page, body);
            } else {
                console.log(fString + "REQUEST STATUS" + response.statusCode);
            }
        }
    );
};

module.exports.sponsorUpdate = function (req, res){
    var fString = flString + "SPONSOR_UPDATE: ";
    var requestOptions, path;
    path = "/api/sponsorsRead/" + req.params.sponsorid;
    var page = 'sponsorUpdate';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {}
    };
    request (
        requestOptions,
        function(err, response, body){
            console.log(fString + "REQUEST FUNCTION ERR: " + err);
            renderSponsorPage(req, res, page, body);
        }
    );
};

module.exports.doSponsorUpdate = function(req, res){
    var fString = flString + "DO_SPONSOR_UPDATE: ";
    var sponsorid = req.params.sponsorid;
    var requestOptions, path;
    path = "/api/sponsorUpdate/" + sponsorid;
    var postData = {
        sponsor : req.body.sponsor,
        institution : req.body.institution,
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
                res.redirect('/sponsorRead/' + sponsorid);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

module.exports.sponsorDelete = function(req, res){
    var requestOptions, path;
    path = "/api/sponsorsDelete/" + req.params.sponsorid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
        requestOptions,
        function (err, response, body){
            if (response.statusCode === 204) {
                res.redirect('/sponsors');
            } else {
                _showError(req, res, response.statusCode);
                console.log("DELETE ERROR");
            }
        }
    );
};

module.exports.sponsorConflicts = function(req, res){
    var fString = flString + "SPONSOR_CONFLICTS: ";
    console.log(fString);
    var requestOptions, path, page, message;
    page = "sponsorConflicts";
    path = "/api/sponsorConflicts";
    var sortQuery = "sponsor";
    var title = "SPONSOR CONFLICTS";
    if(req.query.sort){
        sortQuery = req.query.sort
    }
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {sort : sortQuery}
    }
    request(
        requestOptions,
        function(err, response, body){
            if (err){
                console.log(fString + "REQUEST ERROR: " + err);
            } else if (response.statusCode === 200){
                renderSponsorList(req, res, body, page, message, title);
            } else {
                console.log(fString + "REQUEST STATUS: " + response.status.code);
            }
        }
    );
};
