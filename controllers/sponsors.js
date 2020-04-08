const Sponsor = require('../models/sponsor')

module.exports = {

    getAllSponsors: async (req, res, next) => {
        const sponsors = await Sponsor.find({}, 'name imageUrl category website');
        res.status(200).json({
            data: sponsors,
            message: sponsors.length + ' sponsors found.'
        })
    },

    getSponsorById: async (req, res, next) => {
        const id = req.params.id;
        const sponsor = await Sponsor.findById(id);

        if (sponsor) res.status(200).json({
            data: sponsor
        });
        else return res.status(404).json({
            message: "Sponsor not found"
        });
    },

    postSponsor: async (req, res, next) => {
        const currUser = req.user;

        const newSponsor = new Sponsor(req.value.body);
        newSponsor.addedBy = currUser._id;

        newSponsor.save((err, product) => {
            if (err) res.status(500).json({
                message: "Unable to add sponsor!",
                error: err
            });
            else res.status(200).json({
                message: "Sponsor added",
                data: product
            })
        });

    },

    deleteSponsorWithId: async (req, res, next) => {
        const id = req.params.id;
        Sponsor.findByIdAndDelete(id, (err, doc) => {
            if (err) res.status(500).json({
                message: "Unable to delete sponsor!",
                error: err
            });
            else res.status(200).json({
                message: "Sponsor deleted."
            })
        })
    },

    patchSponsorWithId: async (req, res, next) => {
        const id = req.params.id;
        Sponsor.findByIdAndUpdate(id, req.value.body, {
            new: true
        }, (err, doc) => {
            if (err) return res.status(500).json({
                message: "Unable to update sponsor!",
                error: err
            });
            else res.status(200).json({
                message: "Sponsor updated.",
                data: doc
            })
        })
    },

}