console.log("APP_SERVER/CONTROLLERS/CON_EVENT.JS");
var request = require('request');
var apiOptions = {
    server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server ="http://ccs.herokuapp.com";
}

var _showError = function(req, res, status) {
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
    console.log("APP_SERVER/CONTROLLERS/CON_EVENT.JS _SHOW_ERROR: " + title + " " + content);
    res.status(status);
    res.render('main', {
        title : title,
        content : content
    });
};

renderList = function(req, res, events, page, msg) {
    var message, events, page
    if(!(events instanceof Array)){
        message = "API lookup error: responseBody must be an array";
        events = [];
    } else if (!events.length) {
            message = "No items found";
    } else {
        message = msg;
    }
    res.render(page, {
        title: 'CCS - ' + page,
        pageHeader: {
            title: 'Conference Construction Set - ' + page,
            strapline: 'select a title to find details on that specific event. select a table header to sort by that item.'
        },
        events : events,
        message : message
    });
};

/* GET list page */
module.exports.list = function (req, res){
    console.log("CON_EVENT LIST");
    var requestOptions, path, page;
    var sortQuery = "date";
    var findvalue = "";
    var findkey = "";
    page = "list";
    if (req.query.sort) {
        sortQuery = req.query.sort;
    }
    if (req.query.findvalue != ""){
        findvalue = req.query.findvalue;
    }
    if (req.query.findkey != ""){
        findkey = req.query.findkey;
    }
    path = '/api/events';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {sort : sortQuery, findkey : findkey, findvalue : findvalue}
    }
    request(    
        requestOptions,
        function(err, response, body) {
            if (err) {
                console.log("LIST REQUEST ERROR: " + err);
            } else if (response.statusCode === 200) {
                renderList(req, res, body, page);
            } else {
                console.log("LIST REQUEST STATUS: " + response.statusCode);
            }
        }
    );
};

module.exports.presenters = function(req, res){
    console.log("APP_SERVER/CONTROLLERS/CON_EVENT.JS PRESENTERS");
    var requestOptions, path, sortQuery, findQuery, page;
    page = 'presenters';
    sortQuery = "presenterLast";
    if (req.query.sort) {
        sortQuery = req.query.sort;
    }
    findQuery = {presenterLast : {$gt : ""}}
    path= '/api/presenters';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {sort : sortQuery, find : findQuery}
    }
    request(
        requestOptions,
        function(err, response, body) {
            if (err) {
                console.log("PRESENTERS REQUEST ERROR: " + err);
            } else if (response.statusCode === 200) {
                renderList(req, res, body, page);
            } else {
                console.log("PRESENTERS REQUEST STATUS: " + response.status.code);
            }
        }
    );
};

module.exports.performers = function(req, res){
    console.log("APP_SERVER/CONTROLLERS/CON_EVENT.JS PERFORMERS");
    var requestOptions, path, sortQuery, findQuery, page;
    page = 'performers';
    sortQuery = "performer";
    if (req.query.sort) {
        sortQuery = req.query.sort;
    }
    findQuery = {performer : {$gt : ""}}
    path= '/api/performers';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {sort : sortQuery, find : findQuery}
    }
    request(
        requestOptions,
        function(err, response, body) {
            if (err) {
                console.log("PERFORMERS REQUEST ERROR: " + err);
            } else if (response.statusCode === 200) {
                renderList(req, res, body, page);
            } else {
                console.log("PPERFORMERS REQUEST STATUS: " + response.status.code);
            }
        }
    );
};

// GET SINGLE EVENT
var renderEventPage = function (req, res, page, event) {
    console.log("APP_SERVER/CONTROLLERS/CON_EVENT.JS RENDER_EVENT_PAGE");
    res.render(page, {
        title: event.title,
        pageHeader: {title: event.title},
        event : event
    });
};

module.exports.event = function (req, res){
    console.log("CON_EVENT EVENT: ");
    var requestOptions, path;
    page="event";
    path = "/api/events/" + req.params.eventid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request (
        requestOptions,
        function(err, response, body) {
            renderEventPage(req, res, page, body);
        }
    );
};

module.exports.program = function (req, res) {
    console.log("CON_EVENT PROGRAM: ");
    var requestOptions, path;
    page="program";
    path = "/api/events/" + req.params.eventid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request (
        requestOptions,
        function(err, response, body) {
            renderEventPage(req, res, page, body);
        }
    );
};

module.exports.eventNew = function (req, res){
    console.log("APP_SERVER/CONTROLLERS/CON_EVENT EVENT_NEW: ");
    res.render('new',{
        title : 'CCS - New',
        pageHeader: {
            title: 'Conference Construction Set - Create New Event',
        }
    });
};

module.exports.doEventNew = function(req, res){
    console.log("APP_SERVER/CONTROLLERS/CON_EVENT DOEVENTNEW: ");
    var requestOptions, path, message;
    path = "/api/events" ;
    var postData = {
        title: req.body.title,
        category : req.body.category,
        date : req.body.date,
        start: req.body.start,
        building : req.body.building,
        room : req.body.room,
        hostName : req.body.hostName,
        hostEmail : req.body.hostEmail,
        hostInstitution : req.body.hostInstitution,
        hostCity : req.body.hostCity,
        hostState : req.body.hostState,
        presenterFirst : req.body.presenterFirst,
        presenterLast : req.body.presenterLast,
        presenterEmail : req.body.presenterEmail,
        presenterInstitution : req.body.presenterInstitution,
        presenterCity : req.body.presenterCity,
        presenterState : req.body.presenterState,
        performerName : req.body.performerName,
        performerDirector : req.body.performerDirector,
        performerEmail : req.body.performerEmail,
        performerInstitution : req.body.performerInstitution,
        performerCity : req.body.performerCity,
        performerState : req.body.performerState,
        description : req.body.description,
        modified : false,
        checked : false
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postData
    };
    request(
        requestOptions,
        function(err, response, body) {
            console.log("APP_SERVER/CONTROLLERS/CON_EVENT.JS DO_EVENT_NEW REQUEST RESPONSE.STATUS_CODE: "+ response.statusCode);
            if (response.statusCode === 200) {
                console.log("APP_SERVER/CONTROLLERS/CON_EVENT.JS DO_EVENT_NEW: SUCCESSFULLY POSTED: " + postData.title + " WITH A STATUS OF 200");
                message = "Successfully posted " + postData.title;
                res.redirect('/list');
            } else if (response.statusCode === 201) {
                console.log("APP_SERVER/CONTROLLERS/CON_EVENT.JS DO_EVENT_NEW: SUCCESFULLY CREATED NEW EVENT WITH A STATUS OF 201");
                message = "Successfully posted " + postData.title;
                res.redirect('/list');
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

module.exports.eventUpdate = function (req, res){
    console.log("APP_SERVER/CONTROLLERS/CON_EVENT.JS CON_EVENT EVENT_UPDATE");
    var requestOptions, path;
    path = "/api/events/" + req.params.eventid;
    var page = 'update';
    console.log("APP_SERVER/CONTROLLERS/CON_EVENT.JS EVENT_UPDATE PATH: " + path);    
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request (
        requestOptions,
        function(err, response, body) {
            console.log("APP_SERVER/CONTROLLERS/CON_EVENT.JS EVENT_UPDATE REQUEST FUNCTION ERR: " + err);
            renderEventPage(req, res, page, body);
        }
    );
};

module.exports.doEventUpdate = function(req, res){
    console.log("CON_EVENT DO_EVENT_UPDATE: ");
    var eventid = req.params.eventid;
    console.log("CON_EVENT DO_EVENT_UPDATE: " + req);
    var requestOptions, path;
    path = "/api/update/" + eventid;
    var postData = {
        title: req.body.title,
        category : req.body.category,
        date : req.body.date,
        start: req.body.start,
        building : req.body.building,
        room : req.body.room,
        hostName : req.body.hostName,
        hostEmail : req.body.hostEmail,
        hostInstitution : req.body.hostInstitution,
        hostCity : req.body.hostCity,
        hostState : req.body.hostState,
        presenterFirst : req.body.presenterFirst,
        presenterLast : req.body.presenterLast,
        presenterEmail : req.body.presenterEmail,
        presenterInstitution : req.body.presenterInstitution,
        presenterCity : req.body.presenterCity,
        presenterState : req.body.presenterState,
        performerName : req.body.performerName,
        performerDirector : req.body.performerDirector,
        performerEmail : req.body.performerEmail,
        performerInstitution : req.body.performerInstitution,
        performerCity : req.body.performerCity,
        performerState : req.body.performerState,
        description : req.body.description,
        checked : req.body.checked,
        modified : true,
        modificationDate : Date.now
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postData
    };
    console.log("CON_EVENT DO_EVENT_UPDATE REQUEST: ");
    request(
        requestOptions,
        function(err, response, body) {
            console.log("CON_EVENT DO_EVENT_UPDATE REQUEST RESPONSE.STATUS_CODE: " + response.statusCode);
            if (response.statusCode === 200) {
                console.log("SUCCESSFULLY POSTED: " + postData.title);
                res.redirect(eventid);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

module.exports.eventDelete = function(req, res){
    console.log("APP_SERVER/CONTROLLERS/CON_EVENT.JS DOEVENTDELETE: " + req.params.eventid);
    var requestOptions, path;
    path = "/api/delete/" + req.params.eventid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    console.log("APP_SERVER/CONTROLLERS/CON_EVENT.JS EVENTDELETE URL: " + requestOptions.url);
    request(
        requestOptions,
        function (err, response, body){
            if (response.statusCode === 204) {
                console.log("SUCCESSFULLY DELETED: " + req.params.eventid);
                res.redirect('/list');
            } else {
                _showError(req, res, response.statusCode);
                console.log("DELETE ERROR");
            }
        }
    );
};
