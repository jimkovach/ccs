var flString = "APP_API/CONTROLLERS/CONFLICTS.JS "

mongoose = require('mongoose');
var utilities = require('../../public/js/utilities.js');

var conflictP = function(db, base, event){
    var fString = flString + "CONFLICT_P-";
    var conflictTest = '';
    switch(db){
    case 'events':
        conflictTest = base.building === event.building && base.room === event.room && base.date === event.date && base.start === event.start;
        break;
    case "presenters":
        conflictTest = base.presenterLast === event.presenterLast && base.presenterFirst === event.presenterFirst && base.date === event.date && base.start === event.start;
        break;
    case "performers":
        conflictTest = base.performerName === event.performerName && base.date === event.date && base.start === event.start;
        break;
    case 'exhibits':
        conflictTest = base.booth === event.booth;
        break;
    }
    return conflictTest;
};

var get_id = function(id, collection) {
    var fString = flString + "GET_ID: ";
    for(var i = 0; i < collection.length; i++){
        if(collection[i]._id == id){
            return(i);
        }
    }
};

var buildConflictArray = function(db, collection){
    var fString = flString + "BUILD_CONFLICT_ARRAY: ";
    console.log(fString);
    var conflictArray = [];
    for(var base = 0; base < collection.length; base++){
        for(var entry = base + 1; entry < collection.length; entry++){
            if( conflictP (db, collection[base], collection[entry])){
                conflictArray.push({base_id : collection[base]._id, conflict_id : collection[entry].id});
            }
        }
    }
    return(conflictArray);
};

module.exports.showConflicts = function(db, collection, sortQuery){
    var fString = flString + "SHOW_CONFLICTS: ";
    console.log(fString);
    var conflictArray = [];
    var conflicts = [];
    if(!sortQuery){
        sortQuery = "building";
    }
    conflictArray = buildConflictArray(db, collection);
    if(conflictArray.length > 0){
        for(var i = 0; i < conflictArray.length; i++){
            if(db === 'events'){
                conflicts.push(
                    {"base_id" : collection[get_id(conflictArray[i].base_id, collection)]._id,
                     "conflict_id" : collection[get_id(conflictArray[i].conflict_id, collection)]._id,
                        "base" : collection[get_id(conflictArray[i].base_id, collection)].title,
                      "conflict" : collection[get_id(conflictArray[i].conflict_id, collection)].title,
                      "date" : collection[get_id(conflictArray[i].base_id, collection)].date,
                      "start" : collection[get_id(conflictArray[i].base_id, collection)].start,
                      "building" : collection[get_id(conflictArray[i].base_id, collection)].building,
                      "room" : collection[get_id(conflictArray[i].base_id, collection)].room
                    });
            } else if (db === "presenters"){
                conflicts.push(
                    {"base_id" : collection[get_id(conflictArray[i].base_id, collection)]._id,
                     "conflict_id" : collection[get_id(conflictArray[i].conflict_id, collection)]._id,
                     "base" : collection[get_id(conflictArray[i].conflict_id, collection)].presenterLast + ", " + collection[get_id(conflictArray[i].conflict_id, collection)].presenterFirst,
                     "last" : collection[get_id(conflictArray[i].conflict_id, collection)].presenterLast,
                     "first" : collection[get_id(conflictArray[i].conflict_id, collection)].presenterFirst,
                     "date" : collection[get_id(conflictArray[i].base_id, collection)].date,
                     "start" : collection[get_id(conflictArray[i].base_id, collection)].start,
                     "event" : collection[get_id(conflictArray[i].base_id, collection)].title,
                     "conflict" : collection[get_id(conflictArray[i].conflict_id, collection)].title
                    });
                } else if (db === "performers"){
                conflicts.push(
                    {"base_id" : collection[get_id(conflictArray[i].base_id, collection)]._id,
                     "conflict_id" : collection[get_id(conflictArray[i].conflict_id, collection)]._id,
                     "base" : collection[get_id(conflictArray[i].base_id, collection)].performerName,
                     "date" : collection[get_id(conflictArray[i].base_id, collection)].date,
                     "start" : collection[get_id(conflictArray[i].base_id, collection)].start,
                     "event" : collection[get_id(conflictArray[i].base_id, collection)].title,
                     "conflict" : collection[get_id(conflictArray[i].conflict_id, collection)].title
                    });
            } else if (db === 'exhibits'){
                conflicts.push(
                    {
                        "base_id" : collection[get_id(conflictArray[i].base_id, collection)]._id,
                        "conflict_id" : collection[get_id(conflictArray[i].conflict_id, collection)]._id,
                        "base" : collection[get_id(conflictArray[i].base_id, collection)].exhibit,
                       "conflict" : collection[get_id(conflictArray[i].conflict_id, collection)].exhibit,
                       "booth" : collection[get_id(conflictArray[i].conflict_id, collection)].booth
                    });
            }
        }
        console.log(fString + 'CONFLICT_ARRAY.LENGTH: ' + conflictArray.length);
        return(conflicts.sort(utilities.getSortOrder(sortQuery)));
    } else {
        return(["No conflicts found."]);
    }
};
