const router = require('express-promise-router')();
const Controller = require('../controllers/team');
const { validateBody, schemas } = require('../helpers/teamRouteHelpers');
const {checkIfAdmin} = require('../helpers/access-helper')
const passport=require('passport');
const passportConf=require('../passport');

//localhost:PORT/gallery
router.route('/')
    .get(passport.authenticate('jwt',{session: false}), Controller.getAllMembers)
    .post(passport.authenticate('jwt',{session: false}), checkIfAdmin, validateBody(schemas.insertSchema), Controller.addMember)

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
    .patch(passport.authenticate('jwt',{session: false}), checkIfAdmin, validateBody(schemas.patchSchema), Controller.updateMemberWithId)
    .delete(passport.authenticate('jwt',{session: false}), checkIfAdmin, Controller.deleteMemberWithId)

module.exports=router;