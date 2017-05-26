var mongoose = require( 'mongoose' );

var exhibitSchema = new mongoose.Schema({
    exhibit: String,
    booth: String,
    exhibitor: String,
    title: String,
    address: String,
    city: String,
    state: String,
    zip: Number,
    email: String,
    phone: String,
    web: String,
    description: String,
    creationDate: {type: Date, "default": Date.now},
    modificationDate: {type: Date, "default": Date.now},
    modified: {type: Boolean, "default": false},
    cancelled : {type : Boolean, "default" : false},
    checked : {type : Boolean, "default" : false}
});

mongoose.model('Exhibit', exhibitSchema, 'exhibits');
