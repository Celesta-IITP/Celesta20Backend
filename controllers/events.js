const Event = require('../models/event');
const {
    User,
    USER_ROLES_ENUM
} = require('../models/user');
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
            res.status(404).send("Event not found");
        }
    },


    //admin

    postEvent: async (req, res, next) => {
        const currUser = req.user;

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
    deleteEventWithId: async (req, res, next) => {
        const eventId = req.params.eventId;
        const currUser = req.user;

        const event = await Event.findOne({
            _id: eventId
        });

        if (event) {
            if (event.addedBy == currUser._id || currUser.roles.includes(USER_ROLES_ENUM.ADMIN)) {
                Event.findByIdAndRemove({
                    _id: eventId
                }, (err, doc) => {
                    if (err) res.status(500).send("Unable to delete event");
                    else return res.status(200).send("Event deleted.")
                })
            } else return res.status(403).send("Not authorized")
        } else return res.status(404).send("Event not found!")

    },

    patchEventWithId: async (req, res, next) => {
        const eventId = req.params.eventId;
        const currUser = req.user;

        const event = await Event.findOne({
            _id: eventId
        });

        if (event) {
            if (event.addedBy == currUser._id || currUser.roles.includes(USER_ROLES_ENUM.ADMIN)) {
                Event.findByIdAndUpdate(eventId, req.value.body, {
                    new: true
                }, (err, doc) => {
                    if (err) return res.status(500).send("Unable to update event");
                    else return res.status(200).send("Event updated.")
                })
            } else return res.status(403).send("Not authorized")
        } else return res.status(404).send("Event not found!")

    },

}