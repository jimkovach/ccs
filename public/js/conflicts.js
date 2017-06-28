var flString = "PUBLIC/JS/CONFLICTS.JS: ";
var conflictString = function(db, entry){
    var fString = flString + "CONFLICT_STRING: " + db;
    console.log(fString);
    var conflictString = "";
    switch(db){
    case 'events':
        conflictTest = ("b:" + entry.building + "|r:" + entry.room + "|d:" + entry.date + "|t:" + entry.start).replace(/\s+/,"");
        break;
    case 'exhibits':
        conflictTest = "e:" + entry.exhibit + "|b:" + entry.booth;
        break;
    case "sponsors":
        conflictTest = "s:" + entry.sponsor;
        break;
    }
    console.log(fString + "CONFLICT_TEST: " + conflictTest);
    return conflictTest;
};

var conflict_p = function(base, entry){
    console.log("APP_SERVER/CONTROLLERS/CONFLICTS.JS CONFLICT_P");
    if (conflictString('events', base) == conflictString('events', entry)){
        return(true);
    }
    return(false);
};

var testForConflicts = function(collection){
    console.log("APP_SERVER/CONTROLLERS/CONFLICTS.JS TEST_FOR_CONFLICTS");
    var conflictArray = [];
    for(var base = 0; base < collection.length; base++){
        for(var entry = base + 1; entry < collection.length; entry++){
            if(conflict(collection[base], collection[entry])){
                conflictArray.push({base_id : collection[base]._id, entry_id : collection[entry].id});
            }
        }
    }
    return(conflictArray);
};

var showConflicts = function(collection){
    console.log("APP_SERVER/CONTROLLERS/CONFLICTS.JS SHOW_CONFLICTS");
    var conflictArray = [];
    conflictArray = testForConflicts(collection);
    if(conflictArray.length > 0){
        for(var i = 0; i < conflictArray.length; i++){
            console.log("Conflict between: " +
                        collection[find_by_id(conflictArray[i].base_id, collection)].title + " and " +
                        collection[find_by_id(conflictArray[i].entry_id, collection)].title);
        }
    } else {
        console.log("No conflicts found.");
    }
};

var find_by_id = function(id, collection) {
    console.log("APP_SERVER/CONTROLLERS/CONFLICTS.JS FIND_BY_ID");    
    for(var i = 0; i < collection.length; i++){
        if(collection[i]._id == id){
            return(i);
        }
    }
};
