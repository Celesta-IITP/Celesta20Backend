const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const regSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'event',
        required: true
    },
    paymentId: { //or transactionId
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'refund initiated', 'refunded'],
        default: 'pending'
    },
    teamName: {
        type: String
    },
    teamDetails: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]
}, {timestamps: true});

const Registration = mongoose.model("registration", regSchema);
module.exports = Registration;