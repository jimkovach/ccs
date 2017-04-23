console.log("APP_API/MODELS/DATA_SCHEMA.JS");
var mongoose = require( 'mongoose' )

var dataSchema = new mongoose.Schema({
    title: {type: String, required: 'a title is required'},
    date: String,
    start: String,
    building: String,
    room: String,
    category: String,
    presenterFirst: String,
    presenterLast: String,
    presenterEmail: String,
    presenterInstitution: String,
    presenterCity: String,
    presenterState: String,
    hostName: String,
    hostEmail: String,
    hostInstitution: String,
    hostCity: String,
    hostState: String,
    performerName: String,
    performerEmail: String,
    performerInstitution: String,
    performerCity: String,
    performerState: String,
    performerDirector: String,
    description: String,
    creationDate: {type: Date, "default": Date.now},
    modificationDate: {type: Date, "default": Date.now},
    cancelled : {type: Boolean, "default": false},
    modified : {type: Boolean, "default": false},
    checked : {type: Boolean, "default": false}
});

mongoose.model('Event', dataSchema, 'events');
