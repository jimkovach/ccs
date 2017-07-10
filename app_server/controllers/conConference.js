var flString = "APP_SERVER/CONTROLLERS/CON_CONFERENCE.JS: ";
console.log(flString);

var fs=require("fs");
var request = require("request");
var apiOptions = {
    server : "http://localhost:3000"
};

switch (process.env.NODE_ENV){
case "production":
    apiOptions.server = "http://ccs.herokuapp.com";
    break;
case "heroku_development":
    apiOptions.server = "http://localhost:5000";
    break;
default:
    apiOptions.server = "http://localhost:3000";
    break;
}

console.log(flString + "apiOptions.server: " + apiOptions.server);

var _showError = function(req, res, status){
    var fString = flString + "_SHOW_ERROR: ";
    console.log(fString);
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
    res.render("error", {
        title : title,
        content : content
    });
};

var renderCcsPage = function(req, res, conferences, page, title, msg){
    var fString = flString + "RENDER_PAGE_ONE: ";
    console.log(fString);
    var message = msg;
    if(!title){
        title = page;
    }
    if(!(conferences instanceof Array)){
        message = "API lookup error: responseBody must be and array";
    } else if (!conferences.length){
        message = "No items found";
    } else {
        if(msg){
            message = msg;
        }
    }
    res.render(page, {
        title: page,
        pageHeader: {
            title : title.toUpperCase(),
            strapline: ""
        },
        conferences : conferences,
        message : message
    });
};

module.exports.ccs = function(req, res){
    var fString = flString + "CCS: ";
    console.log(fString);
    var requestOptions, path, page, message, title;
    var sorQuery = "";
    var findvalue = "";
    var findkey = "";
    var title = "Setup: 1. Initial Setup";
    message = "";
    if(!page){
        page = "ccs";
        path = "/api/ccs";
    };
    if (req.query.findvalue != ""){
        findvalue = req.query.findvalue;
    }
    if (req.query.findkey != ""){
        findkey = req.query.findkey;
    }
    requestOptions = {
        url : "http://localhost:3000" + path,
        method : "GET",
        json : {},
        qs : {
            findkey : findkey,
            findvalue : findvalue
        }
    };
    console.log(fString + "REQUEST_OPTIONS.URL: " + requestOptions.url);
    request(
        requestOptions,
        function(err, response, body){
            if (err){
                console.log(fString + "REQUEST ERROR: " + err);
            } else if (response.statusCode == 200) {
                console.log(fString + "REQUEST: " + response.statusCode);
                renderCcsPage(req, res, body, page, title, message);
            } else {
                console.log(fString + "REQUEST STATUS: " + response.statusCode);
            }
        }
    );
};

module.exports.conferenceNew = function(req, res){
    var fString = flString + "CONFERENCE_NEW: ";
    var page = "ccsNew";
    res.render(page, {
        title: "CCS - New Conference",
        pageHeader : {
            title : "Create New Conference",
            strapline : "The year is required"
        },
    });
};

module.exports.doConferenceCreate = function(req, res){
    var fString = flString + "DO_CCS_CREATE: ";
    console.log(fString);
    var page = "ccsNew";
    var requestOptions, path, message;
    path = "/api/ccs/new";
    var postData = {
        year : req.body.year,
        title : req.body.title,
        institution : req.body.institution,
        creationDate : req.body.creationDate,
        modificationDate : req.body.modificationDate,
        modified : req.body.modified
    };
    console.log(fString + "postData.year: " + postData.year);
    /*
    if(!postDate.year){
        console.log("year is required");
        return;
    }
    */    
    console.log(fString + "apiOptions.server: " + apiOptions.server);
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postData
    };
    console.log(fString + "requestOptions.url: " + requestOptions.url);
    request(
        requestOptions,
        function(err, response, body){
            if(response.statusCode == 200){
                message = fString + "Successfuly posted " + postData.year;
                res.redirect("/ccs");
            } else if (response.statusCode === 201) {
                message = "Successfully posted " + postData.exhibit;
                res.redirect("/ccs");
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

var renderConferencePage = function(req, res, page, title, conference){
    var fString = flString + "renderConferencePage";
    console.log(fString);
    res.render(page, {
        title : title,
        pageHeader: {
            title : "CONFERENCE " + title
        },
        conference : conference
    });
};

module.exports.conferenceUpdate = function(req, res){
    var fString = flString + "conferenceUpdate: ";
    console.log(fString);
    var path = "/api/ccsRead/" + req.params.conferenceid;
    console.log(fString + "path: " + path);
    var page = "conferenceUpdate";
    var title = "Update: ";
    var requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {}
    };
    console.log(fString + "requestOptions.url: " + requestOptions.url);
    request (
        requestOptions,
        function(err, response, body) {
            console.log(fString + "request function err: " + err);
            renderConferencePage(req, res, page, title, body);
        }
    );
};

module.exports.doCcsUpdate = function(req, res) {
    var fString = flString + "doCcsUpdate: ";
    console.log(fString);
    var conferenceid = req.params.conferenceid;
    var path = "/api/conferencesUpdate/" + conferenceid;
    var requestOptions = {};
    var postData = {
        year : req.body.year,
        title : req.body.title,
        institution : req.body.institution,
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
            console.log(fString + "response.statusCode: " + response.statusCode);
            if (response.statusCode === 200){
                console.log(fString + "SUCCESS");
                res.redirect("/conferenceUpdate/" + conferenceid);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};
    
module.exports.conferenceDelete = function(req, res){
    var fString = flString + "conferenceDelete: ";
    console.log(fString);
    path = "/api/conferencesDelete/" + req.params.conferenceid;
    console.log(fString + "path: " + path);
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    console.log(fString + "requestOptions.url: " + requestOptions.url);
    request(
        requestOptions,
        function (err, response, body){
            if (response.statusCode === 204) {
                res.redirect("/ccs");
            } else {
                _showError(req, res, response.statusCode);
                console.log(fString + "DELETE ERROR");
            }
        }
    );
};
