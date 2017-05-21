var flString="app_api/routes/index.js: ".toUpperCase();
console.log(flString);
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret : process.env.JWT_SECRET,
    userProperty: 'payload'
});
//var path = require('path');
var path = '../controllers/';
var main = require(path + 'main.js');
var ctrlEvent = require(path + 'conEvent.js');
var ctrlExhibit = require(path + 'conExhibit.js');

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

router.get('/conflicts', ctrlEvent.conflicts);

router.get('/cag', ctrlEvent.cag);
router.get('/caag', ctrlEvent.caag);

router.get('/exhibits', ctrlExhibit.exhibits);
router.get('/exhibitRead/:exhibitid', ctrlExhibit.exhibitRead);
router.get('/exhibitors', ctrlExhibit.exhibitors);
router.get('/exhibit/new', ctrlExhibit.exhibitNew);
router.post('/exhibit/new', ctrlExhibit.doExhibitNew);
router.get('/exhibitDelete/:exhibitid', ctrlExhibit.exhibitDelete);
router.get('/exhibitUpdate/:exhibitid', ctrlExhibit.exhibitUpdate);
router.post('/exhibitUpdate/:exhibitid', ctrlExhibit.doExhibitUpdate);

module.exports = router;
