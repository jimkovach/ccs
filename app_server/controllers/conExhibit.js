var flString = "APP_SERVER/CONTROLLERS/CON_EXHIBIT.JS ";
console.log(flString);

var fs=require('fs');
var request = require('request');
var PDFDocument = require('pdfkit');
var utilities = require('../../public/js/utilities');
var apiOptions = {
    server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server - "http://ccs.herokuapp.com";
}

var _showError = function(req, res, status) {
    var fString = flString + "_SHOWeRROR: ";
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
    res.render('main', {
        title : title,
        content : content
    });
};

var expandTab = function(textStart, textEnd){
    var fString = flString + "EXPAND_TAB: ";
    console.log(fString);
    var newText = "";
    var textLength = textStart.length + textEnd.length;
    newText = textStart;
    console.log(fString + "TEXT_LENGTH: " + textLength);
    console.log(fString + "100 - TEXT_LENGTH: " + (100 - textLength));
    for(var i = 0; i < 100 - textLength; i++){
        newText += '.';
    };
    newText += textEnd;
    return newText;
};

// CREATE PDF
var renderPdf = function(req, res, exhibits, page, msg) {
    var pdf = new PDFDocument;
    fString = flString + "RENDER_PDF: ";
    var file = 'texts/' + page + '.pdf';
    var i = 0;
    pdf.pipe(fs.createWriteStream(file));
    pdf.font('Times-Roman');
    pdf.fontSize(32);
    if(page === "exhibitors"){
        pdf.text(page.toUpperCase(),
                 {align : 'center'});
        pdf.moveDown(1);
        pdf.fontSize(12);
        for (i in exhibits){
            pdf.text(expandTab(exhibits[i].exhibit, exhibits[i].booth));
        }
    } else if (page === "exhibits"){
        pdf.text(page.toUpperCase(),
                 {align : 'center'});
        pdf.moveDown(1);
        pdf.fontSize(12);
        for(i in exhibits){            
            pdf.text(exhibits[i].exhibit,
                     {align : 'center',
                      stroke: true,
                      fill: true});
            pdf.text('Booth ' + exhibits[i].booth,
                     {align : 'center',
                      stroke: true,
                      fill: true});
            pdf.text(exhibits[i].exhibitor + ", " + exhibits[i].title,
                     {align : 'center'});
            pdf.text(exhibits[i].address);
            pdf.text(exhibits[i].city + " " + exhibits[i].state + " " + exhibits[i].zip);
            pdf.text(exhibits[i].email);
            pdf.text(exhibits[i].phone);
            pdf.text(exhibits[i].web);
            pdf.text(exhibits[i].description);
            pdf.moveDown(1);
        }            
    }
    pdf.end();
};

// CREATE TEXT FILES
var renderText = function(req, res, exhibits, page, msg, type) {
    fString = flString + "RENDER_TEXT: ";
    var message;
    var delimiter, postfix;
    var file;
    var i = 0;
    var exhibit_string = '';
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
        renderPdf(req, res, exhibits, page, msg);
    default:
        delimiter = ' ';
        postfix = '.txt';
    }
    file = 'texts/' + page + postfix;
    switch(page){
    case 'exhibitors':
        for(i in exhibits){
            exhibit_string +=
                exhibits[i].exhibit + delimiter +
                exhibits[i].booth +
                '\n';
        }
        break;
    case 'exhibits':
        for(i in exhibits){
            exhibit_string +=
                exhibits[i].exhibit + delimiter +
                exhibits[i].booth + delimiter +
                exhibits[i].exhibitor + delimiter +
                exhibits[i].title + delimiter +
                exhibits[i].address + delimiter +
                exhibits[i].city + delimiter +
                exhibits[i].state  + delimiter +
                exhibits[i].zip + delimiter +
                exhibits[i].email + delimiter +
                exhibits[i].phone + delimiter +
                exhibits[i].web + delimiter +
                exhibits[i].description + delimiter +
                exhibits[i].modified + delimiter +
                exhibits[i].modificationDate + delimiter +
                exhibits[i].cancelled + delimiter +
                '\n';
        }
    }fs.writeFile(file, exhibit_string, function(err) {
        if (err) {
            return console.error(fString + 'ER: ' + err);
        } else {
        }
    });
};

var renderExhibits = function(req, res, exhibits, page, msg, title) {
    fString = flString + "RENDER_EXHIBITS: ";
    var message = msg;
    var textArray = ['txt', 'tab', 'comma', 'line', 'pdf'];
        if(!title){
        title = utilities.toTitleCase(page);
    }
    if(!(exhibits instanceof Array)){
        message = "API lookup error: responseBody must be an array";
        exhibits = [];
    } else if (!exhibits.length) {
        message = "No items found";
    } else {
        if(msg){
            message = msg;
        }
    }
    res.render(page, {
        title: 'CCS - ' + page,
        pageHeader: {
            title: utilities.toTitleCase(page),
            strapline: 'select a title to find details on that specific event. select a table header to sort by that item.'
        },
        exhibits : exhibits,
        message : message
    });
    for(var i = 0; i < textArray.length; i++) {
        renderText(req, res, exhibits, page, msg, textArray[i]);
    }
};

module.exports.exhibits = function(req, res){
    var fString = flString + "EXHIBITS: ";
    console.log(fString);
    var requestOptions, path, page, message, title;
    var sortQuery = "exhibit";
    var findvalue = "";
    var findkey = "";
    var title = "Exhibits";
    message = "";
    if(!page){
        page = "exhibits";
        path = "/api/exhibits";
    };
    console.log(fString + "PAGE: " + page);
    if(req.query.sort) {
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
            findvalue : findvalue
        }
    };
    console.log(fString + "URL: " + requestOptions.url);
    request(
        requestOptions,
        function(err, response, body) {
            if (err) {
                console.log(fString + "LIST REQUEST ERROR: " + err);
            } else if (response.statusCode == 200) {
                renderExhibits(req, res, body, page, message, title);
            } else {
                console.log(fString + "LIST REQUEST STATUS: " + response.statusCode);
            }
        }
    );
};

module.exports.exhibitors = function(req, res){
    var fString = flString + "EXHIBITORS: ";
    console.log(fString);
    var requestOptions, path, page, sortQuery, findQuery;
    var msg = "";
    sortQuery = "exhibitors";
    if (req.query.sort) {
        sortQuery = req.query.sort;
    }
    findQuery = {exhibit : {$gt : ""}};
    path= '/api/exhibitors';
    page = "exhibitors";
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {sort : sortQuery, find : findQuery}
    };
    console.log(fString + "REQUEST_OPTIONS URL: " + requestOptions.url);
    request(
        requestOptions,
        function(err, response, body){
            if(err) {
                console.log(fString + "EXHIBITORS REQUEST ERROR: " + err);
            } else if (response.statusCode === 200) {
                renderExhibits(req, res, body, page, msg, utilities.toTitleCase(page));
                console.log(fString + "EXHIBITORS RESPONSE: " + response.statusCode);
            } else {
                console.log(fString + "EXHIBITORS REQUEST STATUS: " + response.statusCode);
            }
        }
    );
};

var renderExhibitPage = function (req, res, page, exhibit) {
    var fString = flString + "RENDER_EXHIBIT_PAGE: "
    console.log(fString + "PAGE: " + page);
    console.log(fString + "EXHIBIT . EXHIBIT: " + exhibit.exhibit)
    res.render(page, {
        title : exhibit.exhibit,
        pageHeader: { title: exhibit.exhibit},
        exhibit : exhibit
    });
};

module.exports.exhibitRead = function(req, res){
    var fString = flString + "EXHIBIT: ";
    console.log(fString);
    var requestOptions, path, page;
    page = "exhibit.pug";
    path = "/api/exhibitsRead/" + req.params.exhibitid;
    console.log(fString + "PATH: " + path);
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
                renderExhibitPage(req, res, page, body);
            } else {
                console.log(fString + "REQUEST STATUS" + response.statusCode);
            }
        }
    );
};

module.exports.exhibitNew = function(req, res){
    var fString = flString + "EXHIBIT_NEW: ";
    console.log(fString);
    var page = "exhibitNew";
    res.render(page, {
        title: 'CCS - New Exhibit',
        pageHeader : {
            title : 'Create New Exhibit',
            strapline : 'note: the exhibit name is required'
        },
    });
};

module.exports.doExhibitNew = function(req, res){
    var fString = flString + "DO_EXHIBIT_NEW: ";
    console.log(fString);
    var page = "exhibitNew";
    var requestOptions, path, message;
    path = "/api/exhibits/new";
    var postData = {
        exhibit : req.body.exhibit,
        exhibitor : req.body.exhibitor,
        booth : req.body.booth,
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
        cancelled : req.body.cancelled,
        checked : req.body.checked
    };
    console.log(fString + "POST_DATA.EXHIBIT: " + postData.exhibit);
    if(!postData.exhibit){
        console.log("exhibit name is required");
        _showError(req, res, "exhibit name is required");
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
                console.log(fString + "SUCCESSFULLY POSTED: " + postData.exhibit + " WITH A STATUS OF 200");
                message = fString + "Successfully posted " + postData.exhibit;
                res.redirect('/exhibits');
            } else if (response.statusCode === 201) {
                console.log(fString + "SUCCESFULLY CREATED NEW EXHIBIT WITH A STATUS OF 201");
                message = "Successfully posted " + postData.exhibit;
                res.redirect('/exhibits');
            }else{
                _showError(req, res, response.statusCode);
            }
        }
    );
};


module.exports.exhibitUpdate = function(req, res) {
    var fString = flString + "EXHIBIT_UPDATE: ";
    console.log(fString);
    var requestOptions, path;
    path = "/api/exhibitsRead/" + req.params.exhibitid;
    var page = 'exhibitUpdate';
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
        function(err, response, body) {
            console.log(fString + "REQUEST FUNCTION ERR: " + err);
            renderExhibitPage(req, res, page, body);
        }
    );
};    

module.exports.doExhibitUpdate = function(req, res) {
    var fString = flString + "DO_EXHIBIT_UPDATE: ";
    console.log(fString);
    var requestOptions, path;
    var exhibitid = req.params.exhibitid;
    path = "/api/exhibitUpdate/" + exhibitid;
    var postData = {
        exhibit : req.body.exhibit,
        exhibitor : req.body.exhibitor,
        booth : req.body.booth,
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
        modified : true,
        cancelled : req.body.cancelled,
        checked : req.body.checked,
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
                console.log(fString + "REQUEST RESPONSE.STATUSCODE: " + response.statusCode);
                res.redirect('/exhibitRead/' + exhibitid);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

module.exports.exhibitDelete = function(req, res) {
    var fString = flString + "EXHIBIT_DELETE: ";
    console.log(fString);
    var requestOptions, path;
    path = "/api/exhibits/delete/" + req.params.exhibitid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
        requestOptions,
        function (err, response, body){
            if (response.statusCode === 204) {
                console.log(fString + "SUCCESSFULLY DELETED: " + req.params.exhibitid);
                res.redirect('/exhibits');
            } else {
                _showError(req, res, response.statusCode);
                console.log(fString + "DELETE ERROR" );
            }
        }
    );
};

module.exports.exhibitConflicts = function(req, res){
    var fString = flString + "EXHIBIT_CONFLICTS: ";
    console.log(fString);
    var requestOptions, path, page;
    page = 'exhibitConflicts';
    path= '/api/exhibitConflicts';
    var sortQuery = "booth";
    if(req.query.sort){
        sortQuery = req.query.sort;
    }
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {sort : sortQuery}
    }
    console.log(fString + 'REQUEST_OPTIONS.URL: ' + requestOptions.url);
    request(
        requestOptions,
        function(err, response, body) {
            if (err) {
                console.log(fString + " REQUEST ERROR: " + err);
            } else if (response.statusCode === 200) {
                console.log(fString + "REQUEST RENDER: " + requestOptions.url);
                renderExhibits(req, res, body, page);
            } else {
                console.log(fString + " REQUEST STATUS: " + response.status.code);
            }
        }
    );
};
