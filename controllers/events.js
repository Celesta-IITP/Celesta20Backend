const Event=require('../models/event');
const Club=require('../models/club');
const Por=require('../models/por');

module.exports={

    //get all events api (access: auth users)
    getAllEvents: async(req,res,next)=>{
        const events=await Event.find({}).populate('relatedClub','name bio image').sort({_id:-1});
        if(events){
            res.status(200).json({
                events: events
            })
        } else {
            res.status(404).json({
                message: "No events found"
            })
        }
    },

    //get all events of a club api (access: auth users)
    getClubEvents: async(req,res,next)=>{
        const clubId = req.params.clubId;
        const events=await Event.find({relatedClub: clubId}).populate('relatedClub','name bio image').sort({_id:-1});
        if(events){
            res.status(200).json({
                events: events
            })
        } else {
            res.status(404).json({
                message: "No events found"
            })
        }
    },

    //get events by date api (access: auth users)
    getEventsByDate: async(req,res,next)=>{
        const query=parseInt(req.params.timestamp);
        const greaterThan = query - 60*24*60*60*1000;
        const lessThan = query + 60*24*60*60*1000;

        const events=await Event.find({date: {$gt: greaterThan, $lt: lessThan}}).populate('relatedClub','name bio image').sort({_id:-1});
        if(events){
            res.status(200).json({
                events: events
            })
        } else {
            res.status(404).json({
                message: "No events found"
            })
        }
    },

    //post a event api (access: auth users)
    postEvent: async(req,res,next)=>{

        const currUser = req.user;
        const clubId = req.value.body.relatedClub;
        const currPor = await Por.findOne({club:clubId, user: currUser._id});

        if (currPor && currPor.access > 0) {

            const club=await Club.findById(clubId);
            if (club) {
                const event=new Event(req.value.body);
                await event.save();
                club.events.push(event);
                await club.save();
                res.status(200).json({
                    events: event
                })
            } else {
                res.status(404).json({
                    message: "Club not found!"
                })
            }

        } else {
            res.status(401).json({
                message: "Unauthorized user!"
            })
        }

        
    },

    //get event with eventId api (access: auth users)
    getEventWithEventId: async(req,res,next)=>{
        const eventId=req.params.eventId;
        const event=await Event.findOne({_id: eventId}).populate('relatedClub','name bio image');
        if(event){
            res.status(200).send(event);
        } else {
            res.status(404).send("No event found");
        }
        
    },

    //delete event using eventId api (access: eventPoster, superUser)
    deleteEventWithEventId: async(req,res,next)=>{
        const eventId=req.params.eventId;
        userId=req.user.id;
        const event=await Event.findOne({_id: eventId})
        if(event){
            if(event.poster==userId || req.user.isSuperUser==true) {
                const club=await Club.findById(event.relatedClub);
                club.events.pull(eventId);
                club.save();
                await Event.findByIdAndRemove({_id: eventId});
                res.status(200).json({
                    message: "Event deleted"
                });
            } else {
                res.status(401).json({
                    message: "Unauthorized delete request"
                });
            }
        } else {
            res.status(404).json({
                message: "No event found"
            })
        }

    },

    //update(patch) event with eventId api (access: eventPoster, superUer)
    patchEventWithEventId: async(req,res,next)=>{
        const eventId=req.params.eventId;
        const userId=req.user.id;

        const event=await Event.findOne({_id: eventId})
        if(event){
            if(event.poster==userId || req.user.isSuperUser==true) {
                Event.findByIdAndUpdate({_id: eventId},req.value.body,{new:true}).then((event)=>{
                    res.status(200).json({
                        event: event
                    });
                });
            } else {
                res.status(401).json({
                    message: "Unauthorized update request" 
                });
            }
        } else {
            res.status(404).json({
                message: "No event found"
            })
        }
        
    },
    
}