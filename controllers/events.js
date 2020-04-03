const Event = require('../models/event');
const { User, USER_ROLES_ENUM } = require('../models/user');
const Registration = require('../models/registration');

module.exports = {

    getAllEvents: async (req, res, next) => {
        const events = await Event.find({}, 'name description thumbnailUrl venue date startTime endTime eventType teamSize charge');
        if (events) {
            res.status(200).send(events)
        } else {
            res.status(404).send("No events found");
        }
    },

    getEventsByType: async (req, res, next) => {
        const type = req.params.type;
        const events = await Event.find({
            eventType: type
        }, 'name description thumbnailUrl venue date startTime endTime eventType teamSize charge');
        if (events) {
            res.status(200).send(events)
        } else {
            res.status(404).send("No events found");
        }
    },

    getAllDetailedEvents: async (req, res, next) => {
        const events = await Event.find({}, 'name description thumbnailUrl imageUrl venue venueUrl date startTime endTime eventType teamSize charge rulebookUrl registrationUrl postLinks organizers');
        if (events) {
            res.status(200).send(events)
        } else {
            res.status(404).send("No events found");
        }
    },

    getDetailedEventsByType: async (req, res, next) => {
        const type = req.params.type;
        const events = await Event.find({
            eventType: type
        }, 'name description thumbnailUrl imageUrl venue venueUrl date startTime endTime eventType teamSize charge rulebookUrl registrationUrl postLinks organizers');
        if (events) {
            res.status(200).send(events)
        } else {
            res.status(404).send("No events found");
        }
    },

    //get events by date api (access: auth users)
    getEventsByDate: async (req, res, next) => {
        const query = req.params.date;

        const events = await Event.find({
            date: query
        }, 'name description thumbnailUrl venue date startTime endTime eventType teamSize charge');

        if (events) {
            res.status(200).send(events)
        } else {
            res.status(404).send("No events found");
        }
    },

    getDetailedEventsByDate: async (req, res, next) => {
        const query = req.params.date;

        const events = await Event.find({
            date: query
        }, 'name description thumbnailUrl imageUrl venue venueUrl date startTime endTime eventType teamSize charge rulebookUrl registrationUrl postLinks organizers');

        if (events) {
            res.status(200).send(events)
        } else {
            res.status(404).send("No events found");
        }
    },

    getEventById: async (req, res, next) => {
        const eventId = req.params.eventId;
        const event = await Event.findOne({
            _id: eventId
        }, 'name description thumbnailUrl imageUrl venue venueUrl date startTime endTime eventType teamSize charge rulebookUrl registrationUrl postLinks organizers');

        if (event) {
            res.status(200).send(event);
        } else {
            res.status(404).send("No event found");
        }
    },

    registerInEvent: async (req, res, next) => {
        const eventId = req.params.eventId;
        const currUser = req.value.user;

        const event = await Event.findOne({
            _id: eventId
        }, 'name eventType teamSize charge');

        if (event) {

            const existReg = await Registration.findOne({
                userId: currUser._id,
                eventId: eventId
            })

            if (existReg) {
                return res.status(409).send("Already registered");
            }

            if (event.teamSize == 1) {
                let newReg = new Registration({
                    userId: currUser._id,
                    eventId: eventId,
                    orderId: eventId + Date.now()
                })

                newReg.save((err, product) => {
                    if (err) {
                        return res.status(500).send("Registration failed");
                    } else {
                        res.status(200).send("Registration successful")
                    }
                })

            } else {
                let newReg = new Registration({
                    userId: currUser._id,
                    eventId: eventId,
                    orderId: eventId + Date.now(),
                    teamName: req.body.teamName,
                    teamDetails: []
                })

                req.body.teamDetails.forEach(element => {
                    User.findOne({
                        celestaId: element
                    }, 'name', (err, doc) => {
                        if (err) {
                            return res.status(404).send("One of celesta id is invalid!");
                        } else {
                            newReg.teamDetails.push(doc._id)
                        }
                    })
                });

                newReg.save((err, product) => {
                    if (err) {
                        return res.status(500).send("Registration failed");
                    } else {
                        res.status(200).send("Registration successful")
                    }
                })
            }


        } else {
            res.status(404).send("No event found");
        }
    },

    completePayment: async (req, res, next) => {
        const currUser = req.value.user;
        const eventId = req.params.eventId;
        const event = await Event.findOne({
            _id: eventId
        }, 'name eventType teamSize charge');

        if (event) {
            const existReg = await Registration.findOne({
                userId: currUser._id,
                eventId: eventId
            })

            if (existReg) {
                existReg.paymentId = String(req.body.paymentId);
                await existReg.save();
                return res.status(200).send("Payment confirmation successful");
            } else {
                return res.status(404).send("Not registered in event!");
            }
        } else {
            res.status(404).send("No event found");
        }
    },


    //admin

    postEvent: async (req, res, next) => {
        const currUser = req.value.user;

        if (currUser.roles.includes(USER_ROLES_ENUM.ORGANIZER) || currUser.roles.includes(USER_ROLES_ENUM.ADMIN) || currUser.roles.includes(USER_ROLES_ENUM.SUBCOORD) || currUser.roles.includes(USER_ROLES_ENUM.COORD)) {

            const newEvent = new Event(req.value.body);
            newEvent.addedBy = currUser._id;

            newEvent.save((err, product) => {
                if (err) {
                    res.status(500).send("Unable to add event");
                } else {
                    res.status(200).send("Event added")
                }
            });

        } else {
            res.status(403).send("Not authorized to add events");
        }
    },

    //delete event using eventId api (access: eventPoster, superUser)
    deleteEventWithEventId: async (req, res, next) => {
        const eventId = req.params.eventId;
        const currUser = req.value.user;

        const event = await Event.findOne({
            _id: eventId
        });

        if (event) {
            if (event.addedBy == currUser._id || currUser.roles.includes(USER_ROLES_ENUM.ADMIN)) {
                Event.findByIdAndRemove({
                    _id: eventId
                }, (err, doc) => {
                    if (err) {
                        res.status(500).send("Unable to delete event");
                    } else {
                        res.status(200).send("Event deleted.")
                    }
                })
            } else {
                res.status(403).send("Not authorized")
            }
        } else {
            res.status(404).send("Event not found!")
        }
    },

    patchEventWithId: async (req, res, next) => {
        const eventId = req.params.eventId;
        const currUser = req.value.user;

        const event = await Event.findOne({
            _id: eventId
        });

        if (event) {
            if (event.addedBy == currUser._id || currUser.roles.includes(USER_ROLES_ENUM.ADMIN)) {
                Event.findByIdAndUpdate({
                    _id: eventId
                }, req.value.body, {
                    new: true
                }, (err, doc) => {
                    if (err) {
                        res.status(500).send("Unable to update event");
                    } else {
                        res.status(200).send("Event updated.")
                    }
                })
            } else {
                res.status(403).send("Not authorized")
            }
        } else {
            res.status(404).send("Event not found!")
        }

    },

    getRegistrationsByEvent: async (req, res, next) => {
        const eventId = req.params.eventId;
        const currUser = req.value.user;

        if (currUser.roles.includes(USER_ROLES_ENUM.ORGANIZER) || currUser.roles.includes(USER_ROLES_ENUM.ADMIN) || currUser.roles.includes(USER_ROLES_ENUM.SUBCOORD) || currUser.roles.includes(USER_ROLES_ENUM.COORD)) {
            
            const regs = await Registration.find({
                eventId: eventId
            });

            res.status(200).send(regs)

        } else {
            res.status(403).send("Not authorized")
        }
    },

    getRegistrationsByUser: async (req, res, next) => {
        const userId = req.params.userId;
        const currUser = req.value.user;

        if (currUser.roles.includes(USER_ROLES_ENUM.ORGANIZER) || currUser.roles.includes(USER_ROLES_ENUM.ADMIN) || currUser.roles.includes(USER_ROLES_ENUM.SUBCOORD) || currUser.roles.includes(USER_ROLES_ENUM.COORD)) {
            
            const regs = await Registration.find({
                userId: userId
            });

            res.status(200).send(regs)

        } else {
            res.status(403).send("Not authorized")
        }
    },

}