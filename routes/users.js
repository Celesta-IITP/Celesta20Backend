//const express=require('express');
//const router=express.Router();
const router=require('express-promise-router')();
const UsersControllers=require('../controllers/users');
const {validateBody, schemas}=require('../helpers/usersRouteHelpers');
const passport=require('passport');
const passportConf=require('../passport');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/profilephotos/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024*1025*10, // only allow upto 10mb size file
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Please upload images with extension .jpeg/.jpg/.png with file size < 10mb'), false);
        }
    }
});

//localhost:PORT/users/signup
router.route('/signup')
    .post(validateBody(schemas.authSchemaSignUp),UsersControllers.signUp)

//localhost:PORT/users/signin    
router.route('/signin')
    .post(validateBody(schemas.authSchemaSignIn), passport.authenticate('local',{session: false}), UsersControllers.signIn)

//localhost:PORT/users/:id
router.route('/:userId')
    .get(passport.authenticate('jwt',{session: false}), UsersControllers.getUser)

//localhost:PORT/users/profilephoto
router.route('/profilephoto')
    .post(upload.single('profilephoto'), passport.authenticate('jwt',{session: false}), UsersControllers.uploadUserProfileImage)

//localhost:PORT/users/verify
router.route('/verify/:token')
    .get(UsersControllers.activateUser)

//localhost:PORT/users/forgotpwd
router.route('/forgotpwd')
    .post(UsersControllers.forgotPwd)

//localhost:PORT/users/resetpwd
router.route('/resetpwd')
    .post(UsersControllers.resetPwd)


module.exports=router;