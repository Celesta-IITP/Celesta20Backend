const Joi = require('joi');
const {
    Team,
    COMMITTEE,
    POSITION
} = require('../models/team');

module.exports = {

    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                return res.status(400).send(result.error)
            }
            if (!req.value) {
                req.value = {}
            }
            req.value['body'] = result.value;
            next();
        }
    },

    //validation schemas
    schemas: {
        insertSchema: Joi.object().keys({
            user: Joi.string().required(),
            facebookProfile: Joi.string(),
            position: Joi.string().required(),
            committee: Joi.string().required()
        }).unknown(false),
        patchSchema: Joi.object().keys({
            facebookProfile: Joi.string(),
            position: Joi.string(),
            committee: Joi.string()
        }).unknown(false),
    },

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
        if (team.position == POSITION.ORGANIZER || (team.position == POSITION.COORD && team.committee == COMMITTEE.EVENT) || (team.position == POSITION.SUBCOORD && team.committee == COMMITTEE.EVENT) || team.position == POSITION.OVERALLCOORD) {
            req.role = team;
            return next();
        } else {
            return res.status(403).json({
                message: 'You are not authorized for this action!'
            });
        }
    },

    checkGeneralAccess: async (req, res, next) => {
        const team = await Team.findOne({
            user: req.user._id,
        })
        if ((team.position == POSITION.COORD) || (team.position == POSITION.SUBCOORD) || (team.position == POSITION.OVERALLCOORD)) {
            req.role = team;
            return next();
        } else {
            return res.status(403).json({
                message: 'You are not authorized for this action!'
            });
        }
    },

    checkAdminAccess: async (req, res, next) => {
        if (req.user.isAdmin === true) {
            return next();
        } else {
            return res.status(403).json({
                message: 'You are not authorized for this action!'
            });
        }
    },
}