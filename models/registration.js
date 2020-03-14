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
        ref: 'user',
        required: true
    },
    orderId: {
        type: String
    },
    paymentId: { //or transactionId
        type: String
    },
    teamName: {
        type: String
    },
    teamDetails: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]
});

const Registration = mongoose.model("registration", regSchema);
module.exports = Registration;