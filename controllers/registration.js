const Event = require('../models/event');
const {
    User,
    USER_ROLES_ENUM
} = require('../models/user');
const Registration = require('../models/registration');

module.exports = {

    registerInEvent: async (req, res, next) => {
        const eventId = req.params.eventId;
        const currUser = req.user;

        const event = await Event.findOne({
            _id: eventId
        }, 'name eventType teamSize charge');

        if (event) {
            const existReg = await Registration.findOne({
                userId: currUser._id,
                eventId: eventId
            })
            if (existReg) {
                return res.status(409).json({ message: "Already registered!" });
            }

            const existReg2 = await Registration.findOne({
                teamDetails: currUser._id
            })
            if (existReg2) {
                return res.status(409).json({ message: "Already part of a team!" });
            }

            if (event.teamSize == 1) {
                let newReg = new Registration({
                    userId: currUser._id,
                    eventId: eventId,
                    paymentStatus: 'pending'
                })

                newReg.save((err, product) => {
                    if (err) {
                        return res.status(500).json({ message: "Registration failed" });
                    } else {
                        res.status(200).json({ message: "Registration successful" });
                    }
                })

            } else {
                let newReg = new Registration({
                    userId: currUser._id,
                    eventId: eventId,
                    paymentStatus: 'pending',
                    teamName: req.value.body.teamName,
                    teamDetails: []
                })

                const { teamDetails } = req.value.body;
                const teamLength = teamDetails.length;
                if (teamLength > event.teamSize) {
                    return res.status(436).json({ message: `${ teamLength } members not allowed in this event!` });
                }

                for (var i = 0; i < teamLength; i++) {
                    const element = teamDetails[i];
                    const user = await User.findOne({celestaId: element});
                    if (!user) {
                        return res.status(404).json({ message: "One of celesta id is invalid!" });
                    } else {
                        newReg.teamDetails.push(element);
                    }
                }

                newReg.save((err, product) => {
                    if (err) {
                        return res.status(500).json({ message: "Registration failed" });
                    } else {
                        res.status(200).json({ message: "Registration successful" })
                    }
                })
            }

        } else {
            res.status(404).json({ message: "No event found" });
        }
    },

    completePayment: async (req, res, next) => {
        const currUser = req.user;
        const eventId = req.params.eventId;
        const event = await Event.findOne({
            _id: eventId
        }, 'name eventType teamSize charge');

        if (event) {
            const existReg = await Registration.findOne({
                userId: currUser._id,
                eventId: eventId
            })

            //needs changes according to the payment gateway used (paytm or razorpay)
            if (existReg) {
                // existReg.paymentId = String(req.body.paymentId); 
                // await existReg.save();
                return res.status(200).json({ message: "Payment confirmation successful" });
            } else {
                return res.status(404).json({ message: "Not registered in the event as a leader!" });
            }
        } else {
            res.status(404).json({ message: "No event found" });
        }
    },

    getAllRegistrations: async (req, res, next) => {
            const regs = await Registration.find({});
            return res.status(200).json({ data: regs })
    },

    getRegistrationsByEvent: async (req, res, next) => {
        const eventId = req.params.eventId;
        const currUser = req.user;

            const regs = await Registration.find({
                eventId: eventId
            });
            return res.status(200).json({ data: regs })

    },

    getRegistrationById: async (req, res, next) => {
        if (currUser.roles.includes(USER_ROLES_ENUM.ORGANIZER) || currUser.roles.includes(USER_ROLES_ENUM.ADMIN) || currUser.roles.includes(USER_ROLES_ENUM.SUBCOORD) || currUser.roles.includes(USER_ROLES_ENUM.COORD)) {
            const regId = req.params.regId;
            const reg = await Registration.findById(regId);
            if (reg) return res.status(200).json({ data: reg });
            else return res.status(404).json({ message: "Registration not found!" });
        }
    },

    getRegistrationsByUser: async (req, res, next) => {
        const userId = req.params.userId;
        const currUser = req.user;

        if (currUser.roles.includes(USER_ROLES_ENUM.ORGANIZER) || currUser.roles.includes(USER_ROLES_ENUM.ADMIN) || currUser.roles.includes(USER_ROLES_ENUM.SUBCOORD) || currUser.roles.includes(USER_ROLES_ENUM.COORD)) {

            const regs = await Registration.find({
                userId: userId
            });

            return res.status(200).json({ data: regs })

        } else return res.status(403).json({ message: "Not authorized" });
    },

    getMyRegistrations: async (req, res, next) => {
        const currUser = req.user;
        const regs = await Registration.find({
            userId: currUser._id
        });

        return res.status(200).json({ data: regs })
    },

}