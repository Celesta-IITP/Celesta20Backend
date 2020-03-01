const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clubSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    description: {
        type: String
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'event'
    }],
    pors: [{
        type: Schema.Types.ObjectId,
        ref: 'por'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    pages: {
        type : Array, 
        default : []
    },
    website: {
        type: String
    },
    image: {
        type: String
    }
});

const Club = mongoose.model("club", clubSchema);
module.exports = Club;
