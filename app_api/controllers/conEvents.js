var flString = "APP_API/CONTROLLERS/CON_EVENTS.JS: ";

var request = require('request');
var mongoose = require('mongoose');
var conflicts = require('./conflicts.js');
var utilities = require('../../public/js/utilities.js');
var Event = mongoose.model('Event');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.eventsGetAll = function(req, res) {
    var fString = flString + "EVENTS_GET_ALL: ";
    var findQueryObject = {};
    var findValue = req.query.findvalue;
    var findKey = req.query.findkey;
    if(findValue){
        findQueryObject[findKey] = findValue;
    }
    var sortQuery = req.query.sort;
    var results = [];
    if (findKey != ""){
        Event
            .find(findQueryObject)
            .sort(sortQuery)
            .exec(function(err, events) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, events);
                }
            });
    } else {
        Event
            .find()
            .sort(sortQuery)
            .exec(function(err, events) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, events);
                }
            });
    }
};

module.exports.eventsGetConflicts = function(req, res){
    var fString = flString + "EVENTS_GET_CONFLICTS: ";
    var sortQuery = req.query.sort;
    var results = [];
        Event
            .find()
            .exec(function(err, events) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    results = conflicts.showConflicts('events', events, sortQuery);
                    sendJsonResponse(res, 200, results);
                }
            });
};

module.exports.eventsGetPresenterConflicts = function(req, res){
    var fString = flString + "EVENTS_GET_PRESENTER_CONFLICTS: ";
    var findQuery = {"presenterLast" : {$gt : ""}};
    var sortQuery = req.query.sort;
    Event
        .find(findQuery)
        .exec(function(err, events){
            if (err){
                sendJsonResponse(res, 404, err);
            } else {
                results = conflicts.showConflicts('presenters', events, sortQuery);
                sendJsonResponse(res, 200, results);
            }
        });
};

module.exports.eventsGetPerformerConflicts = function(req, res){
    var fString = flString + "EVENTS_GET_PERFORMER_CONFLICTS: ";
    var findQuery = {"performerName" : {$gt : ""}};
    var sortQuery = req.query.sort;
    Event
        .find(findQuery)
        .exec(function(err, events){
            if (err){
                sendJsonResponse(res, 404, err);
            } else {
                results = conflicts.showConflicts('performers', events, sortQuery);
                sendJsonResponse(res, 200, results);
            }
        });
};

module.exports.eventsGetPresenters = function(req, res) {
    var sortQuery = req.query.sort + " : " + 1;
    var findQuery = req.query.find;
    var  results = [];
    Event
        .find(findQuery)
        .sort(sortQuery)
        .exec(function(err, events) {
            if (err) {
                sendJsonResponse(res, 404, err);
            } else {
                sendJsonResponse(res, 200, events);
            }
        });
};

module.exports.eventsGetPerformers = function(req, res) {
    var sortQuery = req.query.sort + " : " + 1;
    var findQuery = {'performerName': {$gt : ""}};
    var  results = [];
    Event
        .find(findQuery)
        .sort(sortQuery)
        .exec(function(err, events) {
            if (err) {
                sendJsonResponse(res, 404, err);
            } else {
                sendJsonResponse(res, 200, events);
            }
        });
};

module.exports.eventsTables = function(req, res) {
    var fString = flString + "EVENTS_TABLES: ";

    
    var sortQuery = req.query.sort + " : " + 1;
    var findQuery = {"building" : req.query.building,
                     "date" : req.query.date
                    }
    Event
        .find(findQuery)
        .sort(sortQuery)
        .exec(function(err, events) {
            if(err) {
                console.log(fString + "Event.exec.ERR");
                sendJsonResponse(res, 404, err);
            } else {
                sendJsonResponse(res, 200, events);
            }
        });
};

module.exports.eventsReadOne = function (req, res) {
    var eventid = req.params.eventid;    
    Event
        .findById(eventid)
        .exec(function(err, events) {
            var response = {
                status : 200,
                message : events
            };
            if (err) {
                response.status = 500;
                response.message = err;
            } else if(!events) {
                response.status = 404;
                response.message = {
                    "message" : "Event ID not found"
                };
            }
            sendJsonResponse(res, 200, events);
        });
};

module.exports.eventsCreate = function(req, res) {    
    Event.create({
        title : req.body.title,
        category : req.body.category,
        dateStart : utilities.convertToDate(req.body.date + " " + req.body.start),
        dateEnd : utilities.convertToDate(req.body.date + " " + req.body.end),
        building: req.body.building,
        room: req.body.room,
        date: req.body.date,
        start: req.body.start,
        end : req.body.end,
        presenterFirst: req.body.presenterFirst,
        presenterLast: req.body.presenterLast,
        presenterEmail: req.body.presenterEmail,
        presenterInstitution: req.body.presenterInstitution,
        presenterCity: req.body.presenterCity,
        presenterState: req.body.presenterState,
        hostName: req.body.hostName,
        hostEmail: req.body.hostEmail,
        hostInstitution: req.body.hostInstitution,
        hostCity: req.body.hostCity,
        hostState: req.body.hostState,
        performerName: req.body.performerName,
        performerEmail: req.body.performerEmail,
        performerInstitution: req.body.performerInstitution,
        performerCity: req.body.performerCity,
        performerState: req.body.performerState,
        performerDirector: req.body.performerDirector,
        description : req.body.description,
        checked : req.body.checked
    }, function(err, events) {
        if (err) {
            console.log(fString + err);
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, events);
        }
    });
};

module.exports.eventsUpdate = function(req, res) {
    var fString = flString + "EVENTS_UPDATE: ";
    if(!req.params.eventid) {
        sendJsonResponse(res, 404, {
            "message" : "CON_EVENTS EVENTS_UPDATE: Not found, eventsid is required"
        });
        return;
    }
    Event
        .findById(req.params.eventid)
        .exec(
            function(err, events) {
                if (!events) {
                    sendJsonResponse(res, 404, {
                        "message": "eventsid not found"
                    });
                    return;
                }else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                events.title = req.body.title,
                events.category = req.body.category,
                events.dateStart = utilities.convertToDate(req.body.date + " " + req.body.start),
                events.dateEnd = utilities.convertToDate(req.body.date + " " + req.body.end),
                events.building = req.body.building,
                events.date = req.body.date,
                events.start = req.body.start,
                events.end = req.body.end,
                events.room = req.body.room,
                events.presenterFirst =  req.body.presenterFirst,
                events.presenterLast = req.body.presenterLast,
                events.presenterEmail = req.body.presenterEmail,
                events.presenterInstitution = req.body.presenterInstitution,
                events.presenterCity = req.body.presenterCity,
                events.presenterState = req.body.presenterState,
                events.hostName = req.body.hostName,
                events.hostEmail = req.body.hostEmail,
                events.hostInstitution = req.body.hostInstitution,
                events.hostCity = req.body.hostCity,
                events.hostState = req.body.hostState,
                events.performerName = req.body.performerName,
                events.performerEmail = req.body.performerEmail,
                events.performerInstitution = req.body.performerInstitution,
                events.performerCity = req.body.performerCity,
                events.performerState = req.body.performerState,
                events.performerDirector = req.body.performerDirector,
                events.description = req.body.description,
                events.checked = req.body.checked,
                events.modified = true,
                events.modificationDate = new Date();
                events.save(function(err, events) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, events);
                    }
                });
            }
        );
};

module.exports.eventsDelete = function(req, res) {    
    var eventid = req.params.eventid;
    if (eventid) {
        Event
            .findByIdAndRemove(eventid)
            .exec(
                function (err, events) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No eventid"
        });
    }
};
