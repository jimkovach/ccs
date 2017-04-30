mongoose = require('mongoose');
var Event = mongoose.model('Event');
var utilities = require('../../public/js/utilities.js');
var flString = "APP_API/CONTROLLERS/CONFLICTS.JS "
console.log(flString);

var conflictP = function(base, event){
    return(base.building === event.building && base.room === event.room && base.date === event.date && base.start === event.start);
};

var get_id = function(id, collection) {
    var fString = flString + "GET_ID: ";
    for(var i = 0; i < collection.length; i++){
        if(collection[i]._id == id){
            return(i);
        }
    }
};

var buildConflictArray = function(collection){
    var fString = flString + "BUILD_CONFLICT_ARRAY: ";
    var conflictArray = [];
    for(var base = 0; base < collection.length; base++){
        for(var entry = base + 1; entry < collection.length; entry++){
            if( conflictP (collection[base], collection[entry])){
                conflictArray.push({base_id : collection[base]._id, conflict_id : collection[entry].id});
                console.log(fString + collection[base]._id + " : " + collection[entry].id);
            }
        }
    }
    return(conflictArray);
};

module.exports.showConflicts = function(collection, sortQuery){
    var conflictArray = [];
    var conflicts = [];
    if(!sortQuery){
        sortQuery = "building";
    }
    conflictArray = buildConflictArray(collection);
    if(conflictArray.length > 0){
        for(var i = 0; i < conflictArray.length; i++){
            conflicts.push(
                { "base_id" : collection[get_id(conflictArray[i].base_id, collection)]._id,
                  "base" : collection[get_id(conflictArray[i].base_id, collection)].title,
                  "conflict_id" : collection[get_id(conflictArray[i].conflict_id, collection)]._id,
                  "conflict" : collection[get_id(conflictArray[i].conflict_id, collection)].title,
                  "date" : collection[get_id(conflictArray[i].base_id, collection)].date,
                  "start" : collection[get_id(conflictArray[i].base_id, collection)].start,
                  "building" : collection[get_id(conflictArray[i].base_id, collection)].building,
                  "room" : collection[get_id(conflictArray[i].base_id, collection)].room
                });
        };
        return(conflicts.sort(utilities.getSortOrder(sortQuery)));
    } else {
          return(["No conflicts found."]);
    }
};
