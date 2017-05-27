var flString = "APP_SERVER/CONTROLLERS/CON_SPONSOR.JS ";
console.log(flString);

var fs = require('fs');
var request = require('request');
var PDFDocument = require('pdfkit');
var pdf = new PDFDocument;
var utilities = require('../../public/js/utilities.js');
var apiOptions = {
    server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "http://ccs.herokuapp.com";
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

var renderSponsorList = function(req, res, sponsors, page, msg, title){
    fString = flString + "RENDER_SPONSOR_LIST: ";
    console.log(fString);
    var message;
    
    if(!title){
        title = utilities.toTitleCase(page);
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
    console.log(fString + "PAGE: " + page);
    console.log(fString + "SPONSORS[0].SPONSOR: " + sponsors[0].sponsor);
    res.render(page, {
        title: page,
        pageHeader: {
            title: utilities.toTitleCase(title),
            strapline: 'sponsors'
        },
        sponsors : sponsors,
        message : message
    });
};

module.exports.sponsors = function (req, res) {
    var fString = flString + "SPONSORS: ";
    console.log(fString);
    var requestOptions, path, page, message;
    var sortQuery = 'sponsor';
    var findvalue = "";
    var findkey = "";
    var title = "Sponsors";
    message = "";
    if(!page){
        page = "sponsors";
        path = '/api/sponsors';
    };
    console.log(fString + "REQ.QUERY.SORT: " + req.query.sort);
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
                console.log(fString + "LIST REQUEST ERROR: " + err);
            } else if (response.statusCode === 200) {
                console.log(fString + "REQUEST SUCCEEDED WITH RESPONSE OF: " + response.statusCode);
                console.log(fString + "REQUEST BODY:" + body[0].sponsor);
                renderSponsorList(req, res, body, page, message, title);
            } else {
                console.log(fString + "LIST REQUEST STATUS: " + response.statusCode);
            }
        }
    );
};

var renderSponsorPage = function (req, res, page, sponsor) {
    var fString = flString + "RENDER_SPONSOR_PAGE: ";
    console.log(fString);
    console.log(fString + "SPONSOR: " + sponsor);
    res.render(page, {
        title: sponsor.sponsor,
        pageHeader: {title : sponsor.sponsor},
        sponsor : sponsor
    });
};


module.exports.sponsorCreate = function(req, res){
    var fString = flString + "SPONSOR_CREATE: ";
    console.log(fString);
    var page = "sponsorNew";
    res.render(page, {
        title: 'CCS - New Sponsor',
        pageHeader : {
            title : 'Create New sponsor',
            strapline : 'note: the sponsor name is required'
        },
    });
};

module.exports.doSponsorCreate = function(req, res){
    var fString = flString + "DO_SPONSOR_CREATE: ";
    console.log(fString);
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
    console.log(fString + "POST_DATA.SPONSOR: " + postData.sponsor);
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
            console.log(fString + "REQUEST RESPONSE.STATUS_CODE: " + response.statusCode);
            if(response.statusCode === 200) {
                console.log(fString + "SUCCESSFULLY POSTED: " + postData.sponsor + " WITH A STATUS OF 200");
                message = fString + "Successfully posted " + postData.sponsor;
                res.redirect('/sponsors');
            } else if (response.statusCode === 201) {
                console.log(fString + "SUCCESFULLY CREATED NEW sponsor WITH A STATUS OF 201");
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
    console.log(fString);
    var requestOptions, path, page;
    page = "sponsor.pug";
    path = "/api/sponsorsRead/" + req.params.sponsorid;;
    console.log(fString + "PATH: " + path);
    console.log(fString + 'SPONSORID: ' + req.params.sponsorid);
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    console.log(fString + "REQUEST_OPTIONS.URL: " + requestOptions.url);
    request (
        requestOptions,
        function(err, response, body) {
            if(err) {
                console.log(fString + "REQUEST ERR: " + err);
            } else if (response.statusCode === 200) {
                console.log(fString + "REQUEST SUCCESSFUL, RESPONSE: " + response.statusCode);
                renderSponsorPage(req, res, page, body);
            } else {
                console.log(fString + "REQUEST STATUS" + response.statusCode);
            }
        }
    );
};

module.exports.sponsorUpdate = function (req, res){
    var fString = flString + "SPONSOR_UPDATE: ";
    console.log(fString);
    var requestOptions, path;
    path = "/api/sponsorsRead/" + req.params.sponsorid;
    var page = 'sponsorUpdate';
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
            renderSponsorPage(req, res, page, body);
        }
    );
};

module.exports.doSponsorUpdate = function(req, res){
    var fString = flString + "DO_SPONSOR_UPDATE: ";
    console.log(fString);
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
                console.log("SUCCESSFULLY DELETED: " + req.params.sponsorid);
                res.redirect('/sponsors');
            } else {
                _showError(req, res, response.statusCode);
                console.log("DELETE ERROR");
            }
        }
    );
};
