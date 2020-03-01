const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    organizers: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],

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
    thumbnailUrl: {
        type: String
    },

    venue: {
        type: String,
        required: true
    },
    venueUrl: {
        type: String,
        required: true
    },
    date: {
        type: String, 
        required: true
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    teamSize: {
        type: Number,
        default: 1
    },

    rulebookUrl: {
        type: String
    },
    registrationUrl: {
        type: String
    },
    registrationCharge: {
        type: Number,
        default: 0
    },

    postLinks : [{
        type : String
    }],

    registrations: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        orderId: {
            type: String
        },
        paymentId: {    //or transactionId
            type: String
        },

    }]

    
});


const Event = mongoose.model("event", eventSchema);
module.exports = Event;
