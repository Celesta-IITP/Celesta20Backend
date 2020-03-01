const router=require('express-promise-router')();
const ClubsControllers=require('../controllers/clubs');
const {validateBody, schemas}=require('../helpers/clubsRouteHelpers');
const passport=require('passport');
const passportConf=require('../passport');

//localhost:3000/clubs/
router.route('/')
    .get(ClubsControllers.getAllClubs)
    .post(passport.authenticate('jwt',{session: false}), validateBody(schemas.clubSchema), ClubsControllers.postClub)

router.route('/v2')
    .get(passport.authenticate('jwt',{session: false}), ClubsControllers.getAuthenticatedClubs)
    .post(passport.authenticate('jwt',{session: false}), validateBody(schemas.clubSchema), ClubsControllers.postClub)

router.route('/v2/:clubId')
    .get(passport.authenticate('jwt',{session: false}), ClubsControllers.getAuthenticatedClubsById)

//localhost:3000/clubs/:clubId
router.route('/:clubId')
    .get(ClubsControllers.getClubWithClubId)
    .delete(passport.authenticate('jwt',{session: false}), ClubsControllers.deleteClubWithClubId)
    .patch(passport.authenticate('jwt',{session: false}), validateBody(schemas.clubSchema), ClubsControllers.patchClubWithClubId)

//localhost:3000/clubs/follow/{clubId}
router.route('/follow/:clubId')
    .post(passport.authenticate('jwt', {session: false}), ClubsControllers.followClub)
    .get(passport.authenticate('jwt', {session: false}), ClubsControllers.getClubFollowers)

module.exports=router;