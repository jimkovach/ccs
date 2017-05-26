var mongoose = require( 'mongoose' );

var sponsorSchema = new mongoose.Schema({
    sponsor: String,
    institution: String,
    creationDate : {type : Date, "default" : Date.now},
    modificationDate : {type : Date, "default" : Date.now},
    modified : {type : Boolean, "default" : false},
    cancelled : {type : Boolean, "default" : false},
    checked : {type : Boolean, "default" : false}
});

mongoose.model('Sponsor', sponsorSchema, 'sponsors');
