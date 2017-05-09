
var flString = "APP_SERVER/CONTROLLERS/CON_EXHIBIT.JS ";
console.log(flString);

var request = require('request');
var utilities = require('../../public/js/utilities');
var apiOptions = {
    server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server - "http://ccs.herokuapp.com";
}
/*
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

renderList = function(req, res, exhibits, page, msg) {
    fString = flString + "RENDER_LIST: "
    var message = msg;
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
        exhibits : exhibits
//        message : message
    });
};

module.exports.exhibits = function(req, res){
    var fString = flString + "EXHIBITS: ";
    console.log(fString);

};

module.exports.exhibit = function(req, res){
    var fString = flString + "EXHIBIT: ";
    console.log(fString);

};

*/

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

/*

module.exports.doExhibitNew = function(req, res)  {
    var fString = flString + "EXHIBIT_NEW: ";
    console.log(fString);

};

module.exports.exhibitUpdate = function(req, res) {
    var fString = flString + "EXHIBIT_UPDATE: ";
    console.log(fString);

};

module.exports.doExhibitUpdate = function(req, res) {
    var fString = flString + "DO_EXHIBIT_UPDATE: ";
    console.log(fString);

};

module.exports.exhibitDelete = function(req, res) {
    var fString = flString + "EXHIBIT_DELETE: ";
    console.log(fString);

};
*/
