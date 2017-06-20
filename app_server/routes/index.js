var flString="app_api/routes/index.js: ".toUpperCase();

var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret : process.env.JWT_SECRET,
    userProperty: 'payload'
});

var path = require('path');
var pth = '../controllers/';
var main = require(pth + 'main.js');
var ctrlEvent = require(pth + 'conEvent.js');
var ctrlExhibit = require(pth + 'conExhibit.js');
var ctrlSponsor = require(pth + 'conSponsor.js');
var ctrlInstrument = require(pth + 'conInst.js');

router.get('/', main.index);

router.get('/events', ctrlEvent.events);
router.get('/event/:eventid', ctrlEvent.event);
router.get('/new', ctrlEvent.eventNew);
router.post('/new', ctrlEvent.doEventNew);
router.get('/update/:eventid', ctrlEvent.eventUpdate);
router.post('/update/:eventid', ctrlEvent.doEventUpdate);
router.get('/delete/:eventid', ctrlEvent.eventDelete);
router.get('/program/:eventid', ctrlEvent.program);
router.get('/conflicts', ctrlEvent.conflicts);

router.get('/presenters', ctrlEvent.presenters);
router.get('/presenterConflicts', ctrlEvent.presenterConflicts);
router.get('/performers', ctrlEvent.performers);
router.get('/performerConflicts', ctrlEvent.performerConflicts);
router.get('/tables', ctrlEvent.tables);

router.get('/exhibits', ctrlExhibit.exhibits);
router.get('/exhibitRead/:exhibitid', ctrlExhibit.exhibitRead);
router.get('/exhibitors', ctrlExhibit.exhibitors);
router.get('/exhibit/new', ctrlExhibit.exhibitNew);
router.post('/exhibit/new', ctrlExhibit.doExhibitNew);
router.get('/exhibitDelete/:exhibitid', ctrlExhibit.exhibitDelete);
router.get('/exhibitUpdate/:exhibitid', ctrlExhibit.exhibitUpdate);
router.post('/exhibitUpdate/:exhibitid', ctrlExhibit.doExhibitUpdate);
router.get('/exhibitConflicts', ctrlExhibit.exhibitConflicts);

router.get('/sponsors', ctrlSponsor.sponsors);
router.get('/sponsorCreate', ctrlSponsor.sponsorCreate);
router.post('/sponsorCreate', ctrlSponsor.doSponsorCreate);
router.get('/sponsorRead/:sponsorid', ctrlSponsor.sponsorRead);
router.get('/sponsorUpdate/:sponsorid', ctrlSponsor.sponsorUpdate);
router.post('/sponsorUpdate/:sponsorid', ctrlSponsor.doSponsorUpdate);
router.get('/sponsorDelete/:sponsorid', ctrlSponsor.sponsorDelete);

router.get('/instrumentCreate', ctrlInstrument.instrumentCreate);
router.post('/instrumentCreate', ctrlInstrument.doInstrumentCreate);
router.get('/instruments', ctrlInstrument.instruments);
router.get('/instrumentRead/:instrumentid', ctrlInstrument.instrumentRead);
router.get('/instrumentUpdate/:instrumentid', ctrlInstrument.instrumentUpdate);
router.post('/instrumentUpdate/:instrumentid', ctrlInstrument.doInstrumentUpdate);
router.get('/instrumentDelete/:instrumentid', ctrlInstrument.instrumentDelete);

router.get('/tables', ctrlEvent.tables);

module.exports = router;
