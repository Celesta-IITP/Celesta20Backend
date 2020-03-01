const {FCM_KEY}=require('../configs/config');

module.exports={

    sendNotification: async(req,res,next)=>{

        const json = req.value.body;
        const key = FCM_KEY

        res.status(200).json({
            message: "Notification sent."
        })
    },

}