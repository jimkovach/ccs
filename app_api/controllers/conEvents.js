console.log("APP_API/CONTROLLERS/CON_EVENTS.JS");
var request = require('request');
var mongoose = require('mongoose');
var Event = mongoose.model('Event');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.eventsGetAll = function(req, res) {
    console.log("EVENTSGETALL");
    console.log("REQ.QUERY: ", req.query);
    var findQueryObject = {};
    var findValue = req.query.findvalue;
    var findKey = req.query.findkey;
    if(findValue){
        findQueryObject[findKey] = findValue;
    }
    

    var sortQuery = req.query.sort + " : " + 1;
    var results = [];
    console.log("EVENTS_GET_ALL FIND_KEY: ", findKey);
    console.log("EVENTS_GET_ALL FIND_VALUE: ", findValue);
    console.log("EVENTS_GET_ALL SORT_QUERY: ", sortQuery);

    if (findKey != ""){
        console.log("EVENTS_GET_ALL FIND_KEY: ", findKey);
        console.log("EVENTS_GET_ALL FIND_VALUE: ", findValue);
        Event
            .find(findQueryObject)
            .sort(sortQuery)
            .exec(function(err, events) {
//                console.log("EVENTS_GET_ALL EVENT:", events);
                if (err) {
                    console.log("EVENTSGETALL ERROR" + err);
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

module.exports.eventsGetPresenters = function(req, res) {
    console.log("EVENTSGET_PRESNETERS");
    var sortQuery = req.query.sort + " : " + 1;
    var findQuery = {'presenterLast': {$gt : ""}};
    var  results = [];
    console.log("EVENTS_PRESENTERS FIND_QUERY: " + findQuery);
    console.log("EVENTS_PRESENTERS SORT_QUERY: " + sortQuery);
    Event
        .find({presenterLast : {$gt : ""}})
        .sort(sortQuery)
        .exec(function(err, events) {
            if (err) {
                console.log("EVENTS_GET_PRESENTERS ERROR" + err);
                sendJsonResponse(res, 404, err);
            } else {
                sendJsonResponse(res, 200, events);
            }
        });
};

module.exports.eventsGetPerformers = function(req, res) {
    console.log("EVENTSGET_PERFORMERS");
    var sortQuery = req.query.sort + " : " + 1;
    var findQuery = {'performerName': {$gt : ""}};
    var  results = [];
    console.log("EVENTS_PERFORMERS FIND_QUERY: " + findQuery);
    console.log("EVENTS_PERFORMERS SORT_QUERY: " + sortQuery);
    Event
        .find({performerName : {$gt : ""}})
        .sort(sortQuery)
        .exec(function(err, events) {
            if (err) {
                console.log("EVENTS_GET_PERFORMERS ERROR" + err);
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
                console.log("CONEVENTS EVENTS_READ_ONE: Error finding events");
                response.status = 500;
                response.message = err;
            } else if(!events) {
                response.status = 404;
                response.message = {
                    "message" : "Event ID not found"
                };
            }
            console.log("CONEVENTS EVENTS_READ_ONE");
            sendJsonResponse(res, 200, events);
        });
};

module.exports.eventsCreate = function(req, res) {    
    Event.create({
        title : req.body.title,
        category : req.body.category,
        date : req.body.date,
        start: req.body.start,
        building: req.body.building,
        room: req.body.room,
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
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, events);
        }
    });
};

module.exports.eventsUpdate = function(req, res) {
    console.log("CON_EVENTS - EVENTS_UPDATE: ");
    if(!req.params.eventid) {
        sendJsonResponse(res, 404, {
            "message" : "CON_EVENTS EVENTS_UPDATE: Not found, eventsid is required"
        });
        return;
    }
    console.log("CON_EVENTS - EVENT_UPDATE REQ.PARAMS.EVENTID: " + req.params.eventid);
    Event
        .findById(req.params.eventid)
        .exec(
            function(err, events) {
                console.log("CON_EVENTS EVENTS_UPDATE EVENT.EXEC FUNCTION: ");
                if (!events) {
                    sendJsonResponse(res, 404, {
                        "message": "eventsid not found"
                    });
                    return;
                }else if (err) {
                    console.log("CON_EVENTS EVENTS_UPDATE EVENT.EXEC FUNCTION ERR: " + err);
                    sendJsonResponse(res, 400, err);
                    return;
                }
                events.title = req.body.title,
                events.category = req.body.category,
                events.date = req.body.date,
                events.start = req.body.start,
                events.building = req.body.building,
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
                        console.log("CON_EVENTS EVENTS_UPDATE AFTER SAVE ERR: " + err);
                        sendJsonResponse(res, 404, err);
                    } else {
                        console.log("CON_EVENTS EVENTS_UPDATE AFTER SAVE DATE " + new Date());
                        sendJsonResponse(res, 200, events);
                    }
                });
            }
        );
};

module.exports.eventsDelete = function(req, res) {    
    var eventid = req.params.eventid;
    console.log("EVENTSDELETE EVENTID: " + eventid);
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
