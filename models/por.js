const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const porSchema = new Schema({
    club: {
        type: Schema.Types.ObjectId,
        ref: 'club',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    position: {
        type: String,
        required: true
    },
    access: {
        type: Number,
        required: false,
        default: 0
    }
});


const Por = mongoose.model("por", porSchema);
module.exports = Por;