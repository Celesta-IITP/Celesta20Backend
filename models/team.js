const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const POSITION = {
    ORGANIZER: 'ORG',
    COORD: 'COORD',
    SUBCOORD: 'SUBC',
    ADVISOR: 'ADV',
    OVERALLCOORD: 'OVC'
}
const COMMITTEE = {
    DEV: 'DEV',
    EVENT: 'EVENT',
    SPONS: 'SPONS',
    MPR: 'MPR',
    HOSPI: 'HOSPI',
    REG: 'REG',
    FLAGSHIP: 'FLAG',
    WORKSHOP: 'WEP',
    CREATIVES: 'CND',
    NONE: 'NONE'
}
const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    facebookProfile: {
        type: String
    },
    position: {
        type: String,
        enum: ['ORG', 'COORD', 'SUBC', 'ADV', 'OVC']
    },
    committee: {
        type: String,
        enum: ['DEV', 'EVENT', 'SPONS', 'MPR', 'HOSPI', 'REG', 'FLAG', 'WEP', 'CND', 'NONE'],
        default: COMMITTEE.NONE
    }
});

const Team = mongoose.model("team", schema);
module.exports = {
    Team,
    POSITION,
    COMMITTEE
};