var flString = "APP_SERVER/CONTROLLERS/CON_EVENT.JS ";
var table = require('../../public/js/table.js');

var fs = require('fs');
var request = require('request');
var PDFDocument = require('pdfkit');
var utilities = require('../../public/js/utilities.js');
var apiOptions = {
    server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server ="http://ccs.herokuapp.com";
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

// CREATE PDF
var renderPdf = function(req, res, events, page, msg) {
    var pdf = new PDFDocument;
    fString = flString + "RENDER_PDF: ";
    var file = 'texts/' + page + '.pdf';
    var i = 0;
    pdf.pipe(fs.createWriteStream(file));
    pdf.font('Times-Roman');
    pdf.fontSize(20);
    pdf.text("WASHINGTON MUSIC EDUCATORS ASSOCIATION",
             {align : 'center'});
    pdf.moveDown(1);
    pdf.fontSize(12);
    for(i in events){
        pdf.text(events[i].date + ' ' + events[i].start + '-' + events[i].end);
        pdf.moveUp(1);
        pdf.text(events[i].building,{align:'right'});
        pdf.text(events[i].category);
        pdf.moveUp(1);
        pdf.text(events[i].room,
                 {align: 'right'}
                );
        pdf.text(events[i].title,{
            align: 'center',
            fill: true,
            stroke: true
        });
        if(events[i].presenterFirst){
            pdf.text('Presenter: ',
                     {continued : true});
            pdf.text(
                events[i].presenterFirst +
                    ' ' +
                    events[i].presenterLast +
                    ', ',
                {stroke : true,
                 fill : true,
                 continued : true
                });
            pdf.text(
                events[i].presenterInstitution +
                    ', ' + events[i].presenterCity +
                    ' ' + events[i].presenterState,
                {stroke : false,
                 continued : false}
            );
        }
        if(events[i].hostName){
            pdf.text('Host: ',
                     {
                         continued : true
                     });
            pdf.text(events[i].hostName + ', ',
                     {stroke : true,
                      fill : true,
                      continued : true
                     });
            pdf.text(events[i].hostInstitution + ', ' +
                     events[i].hostCity +
                     ' ' +
                     events[i].hostState,
                     {
                         stroke : false,
                         continued : false
                     }
                    );
        }
        pdf.text(events[i].description,
                 {
                     features: 'ital'
                 });
        pdf.moveDown(1);
    }
    pdf.end();
};

// CREATE TEXT FILES
var renderText = function(req, res, events, page, msg, type) {
    fString = flString + "RENDER_TEXT: ";
    var message;
    var delimiter, postfix;
    var file;
    var i = 0;
    var event_string = '';
    switch(type){
    case 'tab':
        delimiter = '\t';
        postfix = '.tab';
        break;
    case 'comma':
        delimiter = ',';
        postfix = '.csv';
        break;
    case 'line':
        delimiter = '\n';
        postfix = '.lb.txt';
        break;
    case 'pdf':
        renderPdf(req, res, events, page, msg);
        break;
    default:
        delimiter = ' ';
        postfix = '.txt';
    }
    file = 'texts/' + page + postfix;
    if(type = 'comma'){
        event_string =
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            'PRESENTER' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            'HOST' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            '' + delimiter +
            'PERFORMER' + delimiter +
             '\n' +
            'TITLE' + delimiter +
            'ROOM' + delimiter +
            'DATE' + delimiter +
            'START' + delimiter +
            'END' + delimiter +
            'BUILDING' + delimiter +
            'ROOM' + delimiter +
            'CATEGORY' + delimiter +
            'FIRST' + delimiter +
            'LAST' + delimiter +
            'EMAIL' + delimiter +
            'INSTITUTION' + delimiter +
            'CITY' + delimiter +
            'STATE' + delimiter +
            'NAME' + delimiter +
            'HOST EMAIL' + delimiter +
            'HOST INSTITUTION' + delimiter +
            'HOST CITY' + delimiter +
            'HOST STATE' + delimiter +
            'NAME' + delimiter +
            'PERFORMER EMAIL' + delimiter +
            'PERFORMER INSTITUTION' + delimiter +
            'PERFORMER CITY' + delimiter +
            'PERFORMER STATE' + delimiter +
            'DIRECTOR' + delimiter +
            'DESCRIPTION' +
            '\n';
    }
    for(i in events){
        event_string +=
            '"' + events[i].title + '"' + delimiter +
            events[i].room + delimiter +
            events[i].date + delimiter +
            events[i].start + delimiter +
            events[i].end + delimiter +
            events[i].building + delimiter +
            events[i].room + delimiter +
            events[i].category + delimiter +
            events[i].presenterFirst + delimiter +
            events[i].presenterLast + delimiter +
            events[i].presenterEmail + delimiter +
            events[i].presenterInstitution + delimiter +
            events[i].presenterCity + delimiter +
            events[i].presenterState + delimiter +
            events[i].hostName + delimiter +
            events[i].hostEmail + delimiter +
            events[i].hostInstitution + delimiter +
            events[i].hostCity + delimiter +
            events[i].hostState + delimiter +
            events[i].performerName + delimiter +
            events[i].performerEmail + delimiter +
            events[i].performerInstitution + delimiter +
            events[i].performerCity + delimiter +
            events[i].performerState + delimiter +
            events[i].performerDirector + delimiter +
            '"' + events[i].description +'"' + delimiter +
            '\n';
    }
    fs.writeFile(file, event_string, function(err) {
        if (err){
            return console.error(fString + 'ERR: ' + err);
        } else {
        }
    });
};

var renderList = function(req, res, events, page, msg, title) {
    fString = flString + "RENDER_LIST: ";
    var message;
    var textArray = ['txt', 'tab', 'comma', 'line', 'pdf'];
    if(!title){
        title = page;
    }
    if(!(events instanceof Array)){
        message = "API lookup error: responseBody must be an array";
        events = [];
    } else if (!events.length) {
        message = "No items found";
    } else {
        if(msg){
            message = msg;
        }
    }
    res.render(page, {
        title: title,
        pageHeader: {
            title: title.toUpperCase(),
            strapline: 'select a title to find details on that specific event. select a table header to sort by that item.'
        },
        events : events,
        message : message
    });
    for(var i = 0; i < textArray.length; i++) {
        renderText(req, res, events, page, msg, textArray[i]);
    }
};

/* GET events */
module.exports.events = function (req, res){
    var fString = flString + "EVENTS: ";
    var requestOptions, path, page, message;
    var sortQuery = "dateStart";
    var findvalue = "";
    var findkey = "";
    var title = "Events";
    message = "";
    if(!page){
        page = "events";
        path = "/api/events";
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
                console.log("LIST REQUEST ERROR: " + err);
            } else if (response.statusCode === 200) {
                renderList(req, res, body, page, message, title);
            } else {
                console.log("LIST REQUEST STATUS: " + response.statusCode);
            }
        }
    );
};

var renderTable = function(req, res, events, page, msg, title) {
    var fString = flString + "RENDER_TABLE: ";
    var message;
    var building = req.query.building;
    var date = req.query.date;
    var dt = new Date(date);
    
    title = building + " " + utilities.day(dt.getDay());

    if(!(events instanceof Array)){
        message = "API lookup error: responseBody must be an array";
        events = [];
    } else if (!events.length) {
        message = "No items found";
    } else {
        if(msg){
            message = msg;
        }
    }

    res.render(page, {
        title: title,
        pageHeader: {
            title: title,
        },
        building : building,
        date : date,
        events : events,
        message : message
    });
};

module.exports.tables = function (req, res){
    var fString = flString + "TABLES: ";
    var requestOptions, path, page, message;

    //DEFAULTS
    var sortQuery = "dateStart";
    var building = "Hyatt";
    var date = "02/16/2017";
    var title = building;
    var message = " ";
    if(!page){
        page = "table";
        path = "/api/tables";
    };
    if (req.query.sort) {
        sortQuery = req.query.sort;
    }
    if (req.query.building != ""){
        building = req.query.building;
        title = building;
    }
    if (req.query.date != ""){
        date = req.query.date;
    }
    console.log(fString + "building: " + building);
    console.log(fString + "date: " + date);
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {sort : sortQuery,
              building : building,
              date : date
             }
    }
    console.log(fString + "requestOptions.url: " + requestOptions.url);
    console.log(fString + "requestOptions.qs.building: " + requestOptions.qs.building);
    console.log(fString + "requestOptions.qs.date: " + requestOptions.qs.date);
    request(
        requestOptions,
        function(err, response, body) {
            if (err) {
                console.log(fString + "LIST REQUEST ERROR: " + err);
            } else if (response.statusCode === 200) {
                console.log(fString + "response.statusCode: " + response.statusCode);
                console.log(fString + "request: body.length: " + body.length);
                renderTable(req, res, body, page, message, title);
//                table.doDisplay(building, date, body, res);
            } else {
                console.log(fString + "LIST REQUEST STATUS: " + response.statusCode);
            }
        }
    );
};

/*        
//CONCERT AT A GLANCE (CAAG)
module.exports.caag = function (req, res){
    fString= flString + "CAAG: ";
    var requestOptions, path, page;
    path = '/api/caag';
    var findQuery = {"date" : "02/17/2017", "start" : "08:30 AM", "building" : "Westin"};
    page = "caag";
    requestOptions= {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {findQuery}
    }
    request(
        requestOptions,
        function(err, response, body) {
            if (err) {
                console.log(fString + "LIST REQUEST ERROR: " + err);
            } else if (response.statusCode === 200) {
                //PROBLEM???????
                renderList(req, res, body, page);
            } else {
                console.log("LIST REQUEST STATUS: " + response.statusCode);
            }
        }
    );
    //PROBLEM???????????
    res.render(page, {
        title: page,
        events : events
    });
};

module.exports.caaghs = function(req, res){
    fString = flString + "CAAGHS: ";
    var requestOptions, path, page;
    path = '/api/caag';
    var findQuery = {"date" : "02/19/2017", "start" : "08:30 AM", "building" : "Hyatt"};
    page = "caaghs";
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {findQuery}
    }
    request(
        requestOptions,
        function(err, response, body) {
            if (err) {
                console.log(fString + "LIST REQUEST ERROR: " + err);
            } else if (response.statusCode === 200) {
                //PROBLEM???????
                renderList(req, res, body, page);
            } else {
                console.log("LIST REQUEST STATUS: " + response.statusCode);
            }
        }
    );
    //PROBLEM???????????
    res.render(page, {
        title: page,
        events : events
    });
};
*/

module.exports.presenters = function(req, res){
    var requestOptions, path, sortQuery, findQuery, page;
    page = 'presenters';
    var msg = "";
    sortQuery = "presenterLast";
    if (req.query.sort) {
        sortQuery = req.query.sort;
    }
    findQuery = {presenterLast : {$gt : ""}};
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
                renderList(req, res, body, page, msg, 'PRESENTERS');
            } else {
                console.log("PRESENTERS REQUEST STATUS: " + response.status.code);
            }
        }
    );
};

module.exports.performers = function(req, res){
    var fString = flString = "PERFORMERS: ";
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
                message = (fString + "REQUEST ERROR: " + err);
                console.log(message);
            } else if (response.statusCode === 200) {
                renderList(req, res, body, page);
            } else {
                message = (fString + "PERFORMERS REQUEST STATUS: " + response.status.code);
                console.log(message);
            }
        }
    );
};

module.exports.conflicts = function(req, res){
    var fString = flString + "CONFLICTS: ";
    var requestOptions, path, page;
    page = 'conflicts';
    path= '/api/conflicts';
    var sortQuery = "building";
    if(req.query.sort){
        sortQuery = req.query.sort;
    }
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {sort : sortQuery}
    }
    request(
        requestOptions,
        function(err, response, body) {
            if (err) {
                console.log("APP_SERVER/CONTROLLERS/CON_EVENT.JS CONFLICTS REQUEST ERROR: " + err);
            } else if (response.statusCode === 200) {
                renderList(req, res, body, page);
            } else {
                console.log("APP_SERVER/CONTROLLERS/CON_EVENTJS CONFLICTS REQUEST STATUS: " + response.status.code);
            }
        }
    );
};

// GET SINGLE EVENT
var renderEventPage = function (req, res, page, event) {
    res.render(page, {
        title: event.title,
        pageHeader: {title: page.toUpperCase() + " - " + event.title},
        event : event
    });
};

module.exports.event = function (req, res){
    var requestOptions, path, page;
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
    var fString = flString + "EVENT_NEW: ";
    var requestOptions, path, page;
    page = "new";

    renderEventPage(req, res, page, req.query);
/*    
    res.render('new',{
        title : 'new',
        pageHeader: {
            title: 'Create New Event'
        }
    });
*/
};

module.exports.doEventNew = function(req, res){
    var requestOptions, path, message;
    path = "/api/events" ;

    var postData = {
        title: req.body.title,
        category : req.body.category,
        dateStart : utilities.convertToDate(req.body.date + " " + req.body.start),
        dateEnd : utilities.convertToDate(req.body.date + " " + req.body.end),
        date : req.body.date,
        start : req.body.start,
        end : req.body.end,
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
        checked : req.body.checked
    };
    if(!postData.title){
        console.log("title is required");
        _showError(req, res, "title is required");
        return;
    }
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postData
    };
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 200) {
                message = "Successfully posted " + postData.title;
                res.redirect('/events');
            } else if (response.statusCode === 201) {
                message = "Successfully posted " + postData.title;
                res.redirect('/events');
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

module.exports.eventUpdate = function (req, res){
    var fString = flString + "EVENT_UPDATE: ";
    var requestOptions, path;
    path = "/api/events/" + req.params.eventid;
    var page = 'update';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {}
    };
    request (
        requestOptions,
        function(err, response, body) {
            renderEventPage(req, res, page, body);
        }
    );
};

module.exports.doEventUpdate = function(req, res){
    var fString = flString + "DO_EVENT_UPDATE: ";
    var eventid = req.params.eventid;
    var requestOptions, path;
    path = "/api/update/" + eventid;
    var postData = {
        title: req.body.title,
        category : req.body.category,
        dateStart : utilities.convertToDate(req.body.date + " " + req.body.start),
        dateEnd : utilities.convertToDate(req.body.date + " " + req.body.end),
        date : req.body.date,
        start : req.body.start,
        end : req.body.end,
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
        json : postData,
        qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 200) {
                res.redirect("/event/" + eventid);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

module.exports.eventDelete = function(req, res){
    var requestOptions, path;
    path = "/api/delete/" + req.params.eventid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
        requestOptions,
        function (err, response, body){
            if (response.statusCode === 204) {
                console.log("SUCCESSFULLY DELETED: " + req.params.eventid);
                res.redirect('/events');
            } else {
                _showError(req, res, response.statusCode);
                console.log("DELETE ERROR");
            }
        }
    );
};
