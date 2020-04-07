const router=require('express-promise-router')();
const EventsControllers=require('../controllers/events');
const {validateBody, schemas}=require('../helpers/eventsRouteHelpers');
const {checkIfEventsCommittee, checkIfAdmin} = require('../helpers/access-helper')
const passport=require('passport');
const passportConf=require('../passport');

//localhost:PORT/events
router.route('/')
    .get(passport.authenticate('jwt',{session: false}), EventsControllers.getAllEvents)
    .post(passport.authenticate('jwt',{session: false}), checkIfEventsCommittee, validateBody(schemas.eventSchema), EventsControllers.postEvent)

router.route('/detailed')
    .get(passport.authenticate('jwt',{session: false}), EventsControllers.getAllDetailedEvents)

router.route('/event/:eventId')
    .get(passport.authenticate('jwt',{session: false}), EventsControllers.getEventById)
    .patch(passport.authenticate('jwt',{session: false}), checkIfEventsCommittee, validateBody(schemas.eventSchema), EventsControllers.patchEventWithId)
    .delete(passport.authenticate('jwt',{session: false}), checkIfAdmin, EventsControllers.deleteEventWithId)

router.route('/bytype/:type')
    .get(passport.authenticate('jwt',{session: false}), EventsControllers.getEventsByType)

router.route('/bytype/:type/detailed')
    .get(passport.authenticate('jwt',{session: false}), EventsControllers.getDetailedEventsByType)

router.route('/bydate')
    .get(passport.authenticate('jwt',{session: false}), EventsControllers.getEventsByDate)

router.route('/bydate/detailed')
    .get(passport.authenticate('jwt',{session: false}), EventsControllers.getDetailedEventsByDate)


module.exports=router;