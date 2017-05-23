var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret : process.env.JWT_SECRET,
    userProperty: 'payload'
});
var path = '../controllers/';
var ctrlEvents = require(path + 'conEvents');
var ctrlExhibits = require(path + 'conExhibits');
var ctrlAuth = require(path + 'authentication');

router.get('/events', ctrlEvents.eventsGetAll);
router.get('/events/:eventid', ctrlEvents.eventsReadOne);
router.post('/events', ctrlEvents.eventsCreate);
router.post('/update/:eventid', ctrlEvents.eventsUpdate);
router.get('/delete/:eventid', ctrlEvents.eventsDelete);
router.get('/presenters', ctrlEvents.eventsGetPresenters);
router.get('/performers', ctrlEvents.eventsGetPerformers);
router.get('/conflicts', ctrlEvents.eventsGetConflicts);

router.get('/caag', ctrlEvents.eventsGetCaag);
router.get('/cag', ctrlEvents.eventsGetCag);


router.get('/exhibits', ctrlExhibits.exhibitsGetAll);
router.get('/exhibitsRead/:exhibitid', ctrlExhibits.exhibitsReadOne);
router.get('/exhibitors', ctrlExhibits.exhibitorsReadAll);
router.post('/exhibits/new', ctrlExhibits.exhibitsCreate);
router.post('/exhibitUpdate/:exhibitid', ctrlExhibits.exhibitsUpdate);
router.get('/exhibits/delete/:exhibitid', ctrlExhibits.exhibitsDelete);
router.get('/exhibitConflicts/', ctrlExhibits.exhibitsGetConflicts);

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;