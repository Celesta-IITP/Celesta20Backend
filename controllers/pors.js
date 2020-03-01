const Por=require('../models/por');
const Club=require('../models/club');
const User=require('../models/user');

module.exports={

    //get all pors api (access: auth users)
    getAllPors: async(req,res,next)=>{
        const pors=await Por.find({}).populate('club','name bio').sort({_id:-1});
        if(pors){
            res.status(200).json({
                pors: pors
            })
        } else {
            res.status(404).json({
                message: "No pors found"
            })
        }
    },

    //get all pors of a club api (access: auth users)
    getClubPors: async(req,res,next)=>{
        const clubId = req.params.clubId;
        const pors=await Por.find({club: clubId, access:{$gt: 0}}).populate('user', 'name instituteId').sort({_id:-1});
        if(pors){
            res.status(200).json({
                pors: pors
            })
        } else {
            res.status(404).json({
                message: "No pors found"
            })
        }
    },

    //get all pors of a user api (access: auth users)
    getUserPors: async(req,res,next)=>{
        const userId = req.params.userId;
        const pors=await Por.find({user: userId}).populate('club', 'name').sort({_id:-1});
        if(pors){
            res.status(200).json({
                pors: pors
            })
        } else {
            res.status(404).json({
                message: "No pors found"
            })
        }
    },

    //post a por api (access: auth users)
    postPor: async(req,res,next)=>{
        const club=await Club.findById(req.value.body.club);
        const user=await User.findById(req.value.body.user);
        const por=new Por(req.value.body);
        por.access = 0;
        await por.save();
        club.pors.push(por);
        await club.save();
        let pors=user.pors;
        pors.push(por);
        await User.findByIdAndUpdate({_id: user._id},{pors});
        res.status(200).json({
            pors: por
        })
    },

    //get event with eventId api (access: auth users)
    getPorWithPorId: async(req,res,next)=>{
        const porId=req.params.porId;
        const por=await Por.findOne({_id: porId}).populate('club','name bio');
        if(por){
            res.status(200).json({
                pors: por
            })
        } else {
            res.status(404).json({
                message: "No por found"
            })
        }
        
    },

    //delete por using porId api (access: superUser)
    deletePorWithPorId: async(req,res,next)=>{
        if(!req.user.isSuperUser) {
            return res.status(401).json({
                message: "Unauthorized delete request" 
            });
        }
        const porId=req.params.porId;
        const por=await Por.findOne({_id: porId})
        if(por){
            const club=await Club.findById(por.club);
            club.pors.pull(porId);
            club.save();
            const user=await User.findById(por.user);
            let userPors=user.pors;
            userPors.pull(porId);
            await User.findByIdAndUpdate({_id: por.user},{pors: userPors});
            await Por.findByIdAndRemove({_id: porId});
            res.status(200).json({
                message: "Por deleted"
            });
        } else {
            res.status(404).json({
                message: "No por found"
            })
        }

    },

    //update(patch) por with porId api (access: superUser)
    patchPorWithPorId: async(req,res,next)=>{
        if(!req.user.isSuperUser) {
            return res.status(401).json({
                message: "Unauthorized update request" 
            });
        }
        const porId=req.params.porId;
        const por=await Por.findOne({_id: porId})
        if(por){
            Por.findByIdAndUpdate({_id: porId},req.value.body,{new:true}).then((por)=>{
                res.status(200).json({
                    pors: por
                });
            });
        } else {
            res.status(404).json({
                message: "No por found"
            })
        }
    },

    //update(patch) por with porId api (access: superUser)
    approvePor: async(req,res,next)=>{
        if(!req.user.isSuperUser) {
            return res.status(401).json({
                message: "Unauthorized approve request" 
            });
        }

        const porId = req.value.body.porId;

        const por = await Por.findOne({_id: porId})
        if(por){
            Por.findByIdAndUpdate({_id: porId},{access: req.value.body.access},{new:true}).then((por)=>{
                res.status(200).json({
                    pors: por
                });
            });
        } else {
            res.status(404).json({
                message: "No por found"
            })
        }
    },
    
}