const Feed=require('../models/feed');
const Club=require('../models/club');

module.exports={

    //get all feeds api (access: auth users)
    getAllFeeds: async(req,res,next)=>{
        const feeds=await Feed.find({active:true}).populate('feedPoster','name instituteId').sort({eventId:-1});
        if(feeds){
            res.status(200).json({
                feeds: feeds
            })
        } else {
            res.status(404).json({
                message: "No feeds found"
            })
        }
    },

    //post a feed api (access: auth users)
    postFeed: async(req,res,next)=>{
        const feed=new Feed(req.value.body);
        feed.feedPoster = req.user.id;
        await feed.save();
        res.status(200).json({
            feed: feed
        })
    },

    //get feed with feedId api (access: auth users)
    getFeedWithFeedId: async(req,res,next)=>{
        const feedId=req.params.feedId;

        const feed=await Feed.findOne({_id: feedId}).populate('feedPoster','name instituteId');
        if(feed){
            res.status(200).json({
                feed: feed
            })
        } else {
            res.status(404).json({
                message: "No feed found"
            })
        }
    },

    //get feeds of particular user api (access: auth user)
    getUserFeeds: async(req,res,next)=>{
        const userId=req.user.id;
        const feeds=await Feed.find({feedPoster: userId});
        if(feeds){
            res.status(200).json({
                feeds: feeds
            })
        } else {
            res.status(404).json({
                message: "No feed found"
            })
        }
    },

    //delete feed using feedId if instituteId of auth user=feedPoster   api (access: feedPoster, superUser)
    deleteFeedWithFeedId: async(req,res,next)=>{
        const feedId=req.params.feedId;
        userId=req.user.id;

        const feed=await Feed.findOne({_id: feedId})
        if(feed){
            if(feed.feedPoster==userId || req.user.isSuperUser==true) {
                await Feed.findByIdAndRemove({_id: feedId});
                res.status(200).json({
                    message: "Feed deleted" 
                });
            } else {
                res.status(401).json({
                    message: "Unauthorized delete request" 
                });
            }
            
        } else {
            res.status(404).json({
                message: "No feed found"
            })
        }
    },

    //update(patch) feed with feedId api (access: feedPoster, superUer)
    patchFeedWithFeedId: async(req,res,next)=>{
        const feedId=req.params.feedId;
        const userId=req.user.id;

        const feed=await Feed.findOne({_id: feedId})
        if(feed){
            if(feed.feedPoster==userId || req.user.isSuperUser==true) {
                Feed.findByIdAndUpdate({_id: feedId},req.value.body,{new:true}).then((updatedFeed)=>{
                    res.status(200).json({
                        updatedFeed: updatedFeed
                    });
                });
            } else {
                res.status(401).json({
                    message: "Unauthorized update request" 
                });
            }
            
        } else {
            res.status(404).json({
                message: "No feed found"
            })
        }
    },
    
    //get all feeds whose evenId is greater than current timestamp api (access: auth users)
    getLatestFeedsWithCurrentTimestamp: async(req,res,next)=>{
        const timestamp=req.params.timestamp;
        const query=parseInt(timestamp);

        const latestFeeds=await Feed.find({eventId: {$gt: query} }).populate('feedPoster','name instituteId')
        if(latestFeeds){
            res.status(200).json({
                latestFeeds: latestFeeds
            })
        } else {
            res.status(404).json({
                message: "No feeds found"
            })
        }
    },

    //like a agenda api (access: auth users)
    reactFeed: async(req, res, next) => {
        const currUser = req.user;
        const feedId = req.params.feedId;

        const feed = await Feed.findOne({_id: feedId})

        if (feed) {
            if (feed.likes.indexOf(currUser._id) < 0) {
                feed.likes.push(currUser)
                await feed.save();
                res.status(201).json({
                    message: 'Liked'
                })
            } else {
                let i = feed.likes.indexOf(currUser._id);
                feed.likes.splice(i, 1);
                await feed.save();
                res.status(202).json({
                    message: 'Unliked'
                })
            }
        }
    },

    //get reacts on an agenda api (access: auth users)
    getFeedReacts: async(req, res, next) => {
        const feedId = req.params.feedId;

        const feed = await Feed.findOne({_id: feedId}).populate('likes', 'name instituteId');

        if (feed) {
            if (feed.likes) {
                res.status(200).json({
                    likes: feed.likes
                })
            } else {
                res.status(402).json({
                    message: 'No likes found!'
                })
            }            
        } else {
            res.status(404).json({
                message: 'Feed not found!'
            })
        }
    },    
}