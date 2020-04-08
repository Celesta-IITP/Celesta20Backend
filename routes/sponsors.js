const router = require('express-promise-router')();
const Controller = require('../controllers/sponsors');
const {validateBody, schemas} = require('../helpers/sponsorsRouteHelpers');
const passport = require('passport');
const passportConf = require('../passport');
const {checkIfCommittee, checkIfAdmin} = require('../helpers/access-helper');

//localhost:PORT/gallery
router.route('/')
    .get(passport.authenticate('jwt',{session: false}), Controller.getAllSponsors)
    .post(passport.authenticate('jwt',{session: false}), checkIfCommittee, validateBody(schemas.insertSchema), Controller.postSponsor)

router.route('/image/:imageId')
    .get(passport.authenticate('jwt',{session: false}), Controller.getSponsorById)
    .patch(passport.authenticate('jwt',{session: false}), checkIfCommittee, validateBody(schemas.patchSchema), Controller.patchSponsorWithId)
    .delete(passport.authenticate('jwt',{session: false}), checkIfAdmin, Controller.deleteSponsorWithId)

module.exports = router;