const router=require('express-promise-router')();
const EventsControllers=require('../controllers/events');
const {validateBody, schemas}=require('../helpers/eventsRouteHelpers');
const passport=require('passport');
const passportConf=require('../passport');

//localhost:3000/events
router.route('/')
    .get(EventsControllers.getAllEvents)
    .post(passport.authenticate('jwt',{session: false}), validateBody(schemas.eventSchema), EventsControllers.postEvent)


//localhost:3000/events/club/:clubId
router.route('/club/:clubId')
    .get(EventsControllers.getClubEvents)

//localhost:3000/events/date/:timestmp
router.route('/date/:timestamp')
    .get(EventsControllers.getEventsByDate)

//localhost:3000/events/:eventId
router.route('/:eventId')
    .get(EventsControllers.getEventWithEventId)
    .delete(passport.authenticate('jwt',{session: false}), EventsControllers.deleteEventWithEventId)
    .patch(passport.authenticate('jwt',{session: false}), validateBody(schemas.eventSchema), EventsControllers.patchEventWithEventId)

module.exports=router;