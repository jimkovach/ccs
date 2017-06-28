var mongoose = require( "mongoose" );

var timeSchema = new mongoose.Schema({
    time : {type : String,
        required : "a time is required"
    },
    creationDate : {type : Date, "default" : Date.now},
    modificationDate : {type : Date, "default" : Date.now},
    modified : {tpe : Boolean, "default" : false}
});

var dateSchema = new mongoose.Schema({
    date : {type : String,
            required : "a date is required"
           },
    times : [timeSchema],
    creationDate : {type : Date, "default" : Date.now},
    modificationDate : {type : Date, "default" : Date.now},
    modified : {tpe : Boolean, "default" : false}
});

var roomSchema = new mongoose.Schema({
    room : {type : String,
        required : "a room is required"
    },
    creationDate : {type : Date, "default" : Date.now},
    modificationDate : {type : Date, "default" : Date.now},
    modified : {tpe : Boolean, "default" : false}
});

var setupSchema = new mongoose.Schema({
    year : {type : Number,
            min : 2017,
            required: "a year is required"
           },
    institution : String,
    dates : [dateSchema],
    buildings : [{
        building : String,
        rooms : [roomSchema]
    }],
    creationDate : {type : Date, "default" : Date.now},
    modificationDate : { type : Date, "default" : Date.now},
    modified : {type : Boolean, "default" : false}
});

mongoose.model('Setup', setupSchema, 'setups');
