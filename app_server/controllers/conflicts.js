console.log("APP_SERVER/CONTROLLERS/CONFLICTS.JS");

var conflictString = function(entry){
    console.log("APP_SERVER/CONTROLLERS/CONFLICTS.JS CONFLICT_STRING");
    return(("b:" + entry.building + "|r:" + entry.room + "|d:" + entry.date + "|t:" + entry.start).replace(/\s+/,""));
};

var conflict_p = function(base, event){
    console.log("APP_SERVER/CONTROLLERS/CONFLICTS.JS CONFLICT_P");
    if (conflictString(base) == conflictString(event)){
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
