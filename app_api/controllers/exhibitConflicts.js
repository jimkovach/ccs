var flString = "exhibitConflicts.js";
console.log(flString);

mongoose = require('mongoose');
var Exhibit = mongoose.model('Exhibit');
var utilities = require('../../public/utilities.js');

var conflictP = function(base, exhibit){
	return(base.booth === exhibit.booth);
}

var get_id = function(id, collection) {
	var fString = flString + "GET_ID: ";
	for(var i = 0; i < collection.length; i++) {
		if (collection[i]._id == id){
			return(i);
		}
	}
};

var buildConflictArray = function(collection){
	var fString = flString + "BUILD_CONFLICT_ARRAY: ";
	console.log(fString);
	for(var base = 0; base < collection.length; base++){
		for(var exhibit = base + 1; entry < collection.length; exhibit++){
			if (conflictP (collection[base], collection[exhibit])){
				conflictArray.push({base_id : collection[base]._id, conflict_id : collection[exhibit].id});
			}
		}
	}
	return(conflictArray);
}

module.exports.showConflicts = function(collection, sortQuery){
	var conflictArray = [];
	var conflicts = [];
	if(!sorQuery){
		sortQuery = "booth";
	}
	conflictArray = buildConflictArray(collection);
	if(conflictArray.length > 0){
		for(var i = 0; i < conflictArray.length; i++){
			conflicts.push(
				{ "base_id" : collection[get_id(conflictArray[i].base_id, collection)]._id,
				"base" : collection[get_id(conflictArray[i].base_id, collection)].exhibit,
				"conflict_id" : collection[get_id(conflictArray[i].conflict_id, collection)]._id,
				"conflict" : collection[get_id(conflictArray[i].conflict_id, collection]).booth
			});
		};
		return(conflicts.sort(utilities.getSortOrder(sortQuery)));
	} else {
		return(["No conflicts found."]);
	}
};