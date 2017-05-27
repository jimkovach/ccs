var mongoose = require ('mongoose');

var instrumentSchema = new mongoose.Schema({
    instrument : {type : String, required : 'an instrument is required'},
    serial : {type : String, "default" : ""},
    make : {type : String, "default" : ""},
    model : {type : String, "default" : ""},
    owner : {type : String, "default" : ""},
    group : {type : String, "default" : ""},
    pickupBuilding : {type : String, "default" : ""},
    pickupRoom : {type : String, "default" : ""},
    pickup : {type : Date, "default" : ""},
    pickupDate : {type : Date, "default" : ""},
    pickupTime : {type : String, "default" : ""},
    pickupPerson : {type : String, "default" : ""},
    deliveryBuilding : {type : String, "default" : ""},
    deliveryRoom : {type : String, "default" : ""},
    deliveryDate : {type : Date, "default" : ""},
    deliveryTime : {type : String, "default" : ""},
    deliveryPerson : {type : String, "default" : ""},
    returnDate : { type : Date, "default" : ""},
    returnTime : {type : String, "default" : ""},
    returnPerson : {type : String, "default" : ""},
    cancelled : {type : Boolean, "default" : false},
    checked : {type : Boolean, "default" : false},
    creationDate : {type : Date, "default" : Date.now},
    modified : {type : Boolean, "default" : false},
    modificationDate : {type : Date, "default" : Date.now}
});

mongoose.model('Instrument', instrumentSchema, 'instruments');
