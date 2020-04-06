const router = require('express-promise-router')();
const Controller = require('../controllers/team');
const { validateBody, schemas, checkAdminAccess } = require('../helpers/teamRouteHelpers');
const passport=require('passport');
const passportConf=require('../passport');

//localhost:PORT/gallery
router.route('/')
    .get(passport.authenticate('jwt',{session: false}), Controller.getAllMembers)
    .post(passport.authenticate('jwt',{session: false}), checkAdminAccess, validateBody(schemas.insertSchema), Controller.addMember)

router.route('/committee')
    .get(passport.authenticate('jwt',{session: false}), Controller.getCommitteeMembers)   

router.route('/subcoords')
    .get(passport.authenticate('jwt',{session: false}), Controller.getSubcoords)

router.route('/coords')
    .get(passport.authenticate('jwt',{session: false}), Controller.getCoords)

router.route('/organizers')
	.get(passport.authenticate('jwt',{session: false}), Controller.getOrganizers)
	
router.route('/bycommittee/:committee')
    .get(passport.authenticate('jwt',{session: false}), Controller.getMembersByCommittee)

router.route('/byuser/:userId')
	.get(passport.authenticate('jwt',{session: false}), Controller.getMemberByUserId)
	
router.route('/member/:id')
    .get(passport.authenticate('jwt',{session: false}), Controller.getMemberById)
    .patch(passport.authenticate('jwt',{session: false}), checkAdminAccess, validateBody(schemas.patchSchema), Controller.updateMemberWithId)
    .delete(passport.authenticate('jwt',{session: false}), checkAdminAccess, Controller.deleteMemberWithId)

module.exports=router;