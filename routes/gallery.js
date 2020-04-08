const router=require('express-promise-router')();
const Controller=require('../controllers/gallery');
const {validateBody, schemas}=require('../helpers/galleryRouteHelpers');
const passport=require('passport');
const passportConf=require('../passport');
const {checkIfCommittee, checkIfAdmin} = require('../helpers/access-helper');

//localhost:PORT/gallery
router.route('/')
    .get(passport.authenticate('jwt',{session: false}), Controller.getAllImages)
    .post(passport.authenticate('jwt',{session: false}), checkIfCommittee, validateBody(schemas.gallerySchema), Controller.postImage)

router.route('/image/:imageId')
    .get(passport.authenticate('jwt',{session: false}), Controller.getImageById)
    .patch(passport.authenticate('jwt',{session: false}), checkIfCommittee, validateBody(schemas.patchSchema), Controller.patchImageWithId)
    .delete(passport.authenticate('jwt',{session: false}), checkIfAdmin, Controller.deleteImageWithId)

module.exports=router;