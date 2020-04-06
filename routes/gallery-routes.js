const router=require('express-promise-router')();
const Controller=require('../controllers/gallery');
const {validateBody, schemas}=require('../helpers/gallery-middleware');
const passport=require('passport');
const passportConf=require('../passport');

//localhost:PORT/gallery
router.route('/')
    .get(passport.authenticate('jwt',{session: false}), Controller.getAllImages)
    .post(passport.authenticate('jwt',{session: false}), validateBody(schemas.gallerySchema), Controller.postImage)

router.route('/image/:imageId')
    .get(passport.authenticate('jwt',{session: false}), Controller.getImageById)
    .patch(passport.authenticate('jwt',{session: false}), validateBody(schemas.patchSchema), Controller.patchImageWithId)
    .delete(passport.authenticate('jwt',{session: false}), Controller.deleteImageWithId)

module.exports=router;