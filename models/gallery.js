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
    thumbnailUrl: {
        type: String
    },
    caption: {
        type: String
    }

}, {
    timestamps: true
});


const Gallery = mongoose.model("gallery", schema);
module.exports = Gallery;