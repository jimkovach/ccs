console.log("APP_SERVER/ROUTES/INDEX.JS");
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret : process.env.JWT_SECRET,
    userProperty: 'payload'
});
var path = require('path');
var main = require('../controllers/main.js');
var ctrlEvent = require('../controllers/conEvent.js');


router.get('/', main.index);

router.get('/list', ctrlEvent.list);
router.get('/event/:eventid', ctrlEvent.event);
router.get('/new', ctrlEvent.eventNew);
router.post('/new', ctrlEvent.doEventNew);
router.get('/update/:eventid', ctrlEvent.eventUpdate);
router.post('/update/:eventid', ctrlEvent.doEventUpdate);
router.get('/delete/:eventid', ctrlEvent.eventDelete);
router.get('/program/:eventid', ctrlEvent.program);
router.get('/presenters', ctrlEvent.presenters);
router.get('/performers', ctrlEvent.performers);

//router.get('/conflicts', ctrlEvent.conflicts);

module.exports = router;
