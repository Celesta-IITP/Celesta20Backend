const {
    Team,
    COMMITTEE,
    POSITION
} = require('../models/team');
const {
    User
} = require('../models/user')

module.exports = {

    getAllMembers: async (req, res, next) => {
        const members = await Team.find({}).populate('user', 'name email phone profilePhoto');
        res.status(200).json({
            data: members
        })
    },

    getCommitteeMembers: async (req, res, next) => {
        const members = await Team.find({
            $or: [{
                position: POSITION.COORD
            }, {
                position: POSITION.SUBCOORD
            }, {
                position: POSITION.OVERALLCOORD
            }]
        }).populate('user', 'name email phone profilePhoto');
        res.status(200).json({
            data: members
        })
    },

    getSubcoords: async (req, res, next) => {
        const members = await Team.find({
            position: POSITION.SUBCOORD
        }).populate('user', 'name email phone profilePhoto');
        res.status(200).json({
            data: members
        })
    },

    getCoords: async (req, res, next) => {
        const members = await Team.find({
            position: POSITION.COORD
        }).populate('user', 'name email phone profilePhoto');
        res.status(200).json({
            data: members
        })
    },

    getOrganizers: async (req, res, next) => {
        const members = await Team.find({
            position: POSITION.ORGANIZER
        }).populate('user', 'name email phone profilePhoto');
        res.status(200).json({
            data: members
        })
    },

    getMembersByCommittee: async (req, res, next) => {
        const committee = req.params.committee;
        const members = await Team.find({
            committee: committee
        }).populate('user', 'name email phone profilePhoto');
        res.status(200).json({
            data: members
        })
    },

    getMemberById: async (req, res, next) => {
        const id = req.params.id;
        const member = await Team.findById(id);

        if (member) res.status(200).json({
            data: member
        })
        else return res.status(404).json({
            message: "Member not found"
        });
    },

    getMemberByUserId: async (req, res, next) => {
        const userId = req.params.userId;
        const member = await Team.findOne({
            user: userId
        });

        if (member) res.status(200).json({
            data: member
        })
        else return res.status(404).json({
            message: "Member not found"
        });
    },

    addMember: async (req, res, next) => {
        const currUser = req.user;

        if (currUser.isAdmin === true) {

            const user = await User.findById(req.value.body.user, 'name')
            if (user) {
                const newMember = new Team(req.value.body);
                newMember.save((err, product) => {
                    if (err) return res.status(500).json({
                        message: 'Unable to add member!'
                    })
                    else return res.status(200).json({
                        message: "Member added"
                    });
                });
            } else return res.status(404).json({
                message: "User not found!"
            });
        } else return res.status(403).json({
            message: "Not authorized to add member!"
        });
    },

    deleteMemberWithId: async (req, res, next) => {
        const currUser = req.user;
        const id = req.params.id;

        if (currUser.isAdmin === true) {
            Team.findByIdAndDelete(id, (err, doc) => {
                if (err) return res.status(200).json({
                    message: 'Unable to add member!'
                })
                else return res.status(200).json({
                    message: "Member deleted"
                });
            })
        } else return res.status(403).json({
            message: "Not authorized to delete member!"
        });
    },

    updateMemberWithId: async (req, res, next) => {
        const currUser = req.user;
        const id = req.params.id;

        if (currUser.isAdmin === true) {
            Team.findByIdAndUpdate(id, req.value.body, {
                new: true
            }, (err, doc) => {
                if (err) return res.status(200).json({
                    message: 'Unable to edit member!'
                })
                else return res.status(200).json({
                    message: "Member updated"
                });
            })
        } else return res.status(403).json({
            message: "Not authorized to edit member!"
        });
    },

}