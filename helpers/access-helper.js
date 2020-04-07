const {
    Team,
    COMMITTEE,
    POSITION
} = require('../models/team');

module.exports = {

    checkIfOrganizer: async (req, res, next) => {
        const team = await Team.findOne({
            user: req.user._id,
            position: POSITION.ORGANIZER
        })
        if (team) {
            req.role = team;
            return next();
        } else {
            return res.status(403).json({
                message: 'You are not authorized for this action!'
            });
        }
    },

    checkEventAccess: async (req, res, next) => {
        const team = await Team.findOne({
            user: req.user._id,
        })
        if (team) {
            if (team.position == POSITION.ORGANIZER || (team.position == POSITION.COORD && team.committee == COMMITTEE.EVENT) || (team.position == POSITION.SUBCOORD && team.committee == COMMITTEE.EVENT) || team.position == POSITION.OVERALLCOORD) {
                req.role = team;
                return next();
            }
        }
        return res.status(403).json({
            message: 'You are not authorized for this action!'
        });
    },

    checkIfCommittee: async (req, res, next) => {
        const team = await Team.findOne({
            user: req.user._id,
        })
        if (team) {
            if ((team.position == POSITION.COORD) || (team.position == POSITION.SUBCOORD) || (team.position == POSITION.OVERALLCOORD)) {
                req.role = team;
                return next();
            }
        }
        return res.status(403).json({
            message: 'You are not authorized for this action!'
        });
    },

    checkIfEventsCommittee: async (req, res, next) => {
        const team = await Team.findOne({
            user: req.user._id,
            committee: COMMITTEE.EVENT
        })
        if (team) {
            if (team.position == POSITION.COORD || team.position == POSITION.SUBCOORD) {
                req.role = team;
                return next();
            }
        }
        return res.status(403).json({
            message: 'You are not authorized for this action!'
        });
    },

    checkIfHospiCommittee: async (req, res, next) => {
        const team = await Team.findOne({
            user: req.user._id,
            committee: COMMITTEE.HOSPI
        })
        if (team) {
            if (team.position == POSITION.COORD || team.position == POSITION.SUBCOORD) {
                req.role = team;
                return next();
            }
        }
        return res.status(403).json({
            message: 'You are not authorized for this action!'
        });
    },

    checkIfSponsCommittee: async (req, res, next) => {
        const team = await Team.findOne({
            user: req.user._id,
            committee: COMMITTEE.SPONS
        })
        if (team) {
            if (team.position == POSITION.COORD || team.position == POSITION.SUBCOORD) {
                req.role = team;
                return next();
            }
        }
        return res.status(403).json({
            message: 'You are not authorized for this action!'
        });
    },

    checkIfRegCommittee: async (req, res, next) => {
        const team = await Team.findOne({
            user: req.user._id,
            committee: COMMITTEE.REG
        })
        if (team) {
            if (team.position == POSITION.COORD || team.position == POSITION.SUBCOORD) {
                req.role = team;
                return next();
            }
        }
        return res.status(403).json({
            message: 'You are not authorized for this action!'
        });
    },

    checkIfFlagshipCommittee: async (req, res, next) => {
        const team = await Team.findOne({
            user: req.user._id,
            committee: COMMITTEE.SPONS
        })
        if (team) {
            if (team.position == POSITION.COORD || team.position == POSITION.SUBCOORD) {
                req.role = team;
                return next();
            }
        }
        return res.status(403).json({
            message: 'You are not authorized for this action!'
        });
    },

    checkIfFieldCommittee: async (req, res, next) => {
        const team = await Team.findOne({
            user: req.user._id
        })
        if (team) {
            if ((team.committee == COMMITTEE.EVENT || team.committee == COMMITTEE.WORKSHOP || team.committee == COMMITTEE.REG ||
                    team.committee == COMMITTEE.HOSPI || team.committee == COMMITTEE.FLAGSHIP) &&
                (team.position == POSITION.COORD || team.position == POSITION.SUBCOORD)) {
                req.role = team;
                return next();
            } else if (team.position == POSITION.OVERALLCOORD) {
                req.role = team;
                return next();
            }
        }
        return res.status(403).json({
            message: 'You are not authorized for this action!'
        });
    },

    checkIfAdmin: async (req, res, next) => {
        if (req.user.isAdmin === true) {
            return next();
        } else {
            return res.status(403).json({
                message: 'You are not authorized for this action!'
            });
        }
    },


}