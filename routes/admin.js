const router=require('express-promise-router')();
const AdminControllers=require('./../controllers/admin');
const passport=require('passport');

//localhost:PORT/admin/notification
// router.route('/notification')
//     .post(passport.authenticate('jwt',{session: false}), AdminControllers.sendNotification)


module.exports=router;