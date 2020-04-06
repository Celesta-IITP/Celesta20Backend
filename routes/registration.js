const router=require('express-promise-router')();
const Controller=require('../controllers/registration');
const {validateBody, schemas}=require('../helpers/registration-middleware');
const passport=require('passport');
const passportConf=require('../passport');

//localhost:PORT/registrations
router.route('/')
    .get(passport.authenticate('jwt',{session: false}), Controller.getAllRegistrations)

router.route('/register/:eventId')
    .post(passport.authenticate('jwt',{session: false}), validateBody(schemas.regSchema), Controller.registerInEvent)

router.route('/completepayment/:eventId')
    .post(passport.authenticate('jwt',{session: false}), Controller.completePayment)

router.route('/byevent/:eventId')
    .post(passport.authenticate('jwt',{session: false}), Controller.getRegistrationsByEvent)

router.route('/registration/:regId')
    .get(passport.authenticate('jwt',{session: false}), Controller.getRegistrationById)

router.route('/byuser/:userId')
    .get(passport.authenticate('jwt',{session: false}), Controller.getRegistrationsByUser)

router.route('/myregistrationa')
    .get(passport.authenticate('jwt',{session: false}), Controller.getMyRegistrations)

module.exports=router;