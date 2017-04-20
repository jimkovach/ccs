console.log("APP_API/ROUTES/INDEX.JS");
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret : process.env.JWT_SECRET,
    userProperty: 'payload'
});
var ctrlEvents = require('../controllers/conEvents');
var ctrlAuth = require('../controllers/authentication');

router.get('/events', ctrlEvents.eventsGetAll);
router.get('/events/:eventid', ctrlEvents.eventsReadOne);
router.post('/events', ctrlEvents.eventsCreate);
router.post('/update/:eventid', ctrlEvents.eventsUpdate);
router.get('/delete/:eventid', ctrlEvents.eventsDelete);
router.get('/presenters', ctrlEvents.eventsGetPresenters);
router.get('/performers', ctrlEvents.eventsGetPerformers);

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
