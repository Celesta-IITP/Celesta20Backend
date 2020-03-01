const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    relatedClub: {
        type: Schema.Types.ObjectId,
        ref: 'club',
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    date: {
        type:Number, 
        required: true
    },
    postLinks : {
        type : Array , 
        "default" : []
    },
    
});


const Event = mongoose.model("event", eventSchema);
module.exports = Event;
