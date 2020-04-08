const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'sponsor'
    },
    website: {
        type: String
    }
}, {
    timestamps: true
});


const Sponsor = mongoose.model("sponsor", schema);
module.exports = Sponsor;