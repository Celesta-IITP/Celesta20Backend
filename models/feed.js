const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedSchema = new Schema({
    feedPoster: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    eventVenue: {
        type: String,
        required: false
    },
    eventName: {
        type: String,
        required: true
    },
    eventDescription: {
        type: String,
        required: true
    },
    eventImageUrl: {
        type: String
    },
    eventDate: {
        type:Number, 
        required: false
    },
    eventId: {
        type:Number,
        default: new Date().getTime()
    },
    coordinators : { 
        type : Array , 
        "default" : []
    },
    postLinks : {
        type : Array , 
        "default" : []
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    active: {
        type: Boolean,
        default: true,
        required: true
    }
});


const Feed = mongoose.model("feed", feedSchema);
module.exports = Feed;
