const router=require('express-promise-router')();
const EventsControllers=require('../controllers/events');
const {validateBody, schemas}=require('../helpers/eventsRouteHelpers');
const passport=require('passport');
const passportConf=require('../passport');

//localhost:PORT/events
// router.route('/')
//     .get(EventsControllers.getAllEvents)
//     .post(passport.authenticate('jwt',{session: false}), validateBody(schemas.eventSchema), EventsControllers.postEvent)


// //localhost:PORT/events/club/:clubId
// router.route('/club/:clubId')
//     .get(EventsControllers.getClubEvents)

// //localhost:PORT/events/date/:timestmp
// router.route('/date/:timestamp')
//     .get(EventsControllers.getEventsByDate)

// //localhost:PORT/events/:eventId
// router.route('/:eventId')
//     .get(EventsControllers.getEventWithEventId)
//     .delete(passport.authenticate('jwt',{session: false}), EventsControllers.deleteEventWithEventId)
//     .patch(passport.authenticate('jwt',{session: false}), validateBody(schemas.eventSchema), EventsControllers.patchEventWithEventId)

module.exports=router;