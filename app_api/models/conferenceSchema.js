var mongoose = require( "mongoose" );

var timeSchema = new mongoose.Schema({
    time : {type : String
    },
    creationDate : {type : Date, "default" : Date.now},
    modificationDate : {type : Date, "default" : Date.now},
    modified : {tpe : Boolean, "default" : false}
});

var dateSchema = new mongoose.Schema({
    date : {type : String
           },
    times : [timeSchema],
    creationDate : {type : Date, "default" : Date.now},
    modificationDate : {type : Date, "default" : Date.now},
    modified : {tpe : Boolean, "default" : false}
});

var roomSchema = new mongoose.Schema({
    room : {type : String
    },
    creationDate : {type : Date, "default" : Date.now},
    modificationDate : {type : Date, "default" : Date.now},
    modified : {tpe : Boolean, "default" : false}
});

var conferenceSchema = new mongoose.Schema({
    year : {type : Number,
            min : 2017,
            required: "a year is required"
           },
    title : String,
    institution : String,
    dates : [dateSchema],
    buildings : [{
        building : String
    }],
    creationDate : {type : Date, "default" : Date.now},
    modificationDate : { type : Date, "default" : Date.now},
    modified : {type : Boolean, "default" : false}
});

mongoose.model('Conference', conferenceSchema, 'conferences');
