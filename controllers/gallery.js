const Gallery = require('../models/gallery')

module.exports = {

    getAllImages: async (req, res, next) => {
        const images = await Gallery.find({}, 'caption imageUrl thumbnailUrl');
        res.status(200).send(images)
    },

    getImageById: async (req, res, next) => {
        const imageId = req.params.imageId;
        const image = await Gallery.findById(imageId);

        if (image) res.status(200).send(image);
        else return res.status(404).send("IMage not found");
    },

    postImage: async (req, res, next) => {
        const currUser = req.user;

        if (currUser.roles.includes(USER_ROLES_ENUM.ORGANIZER) || currUser.roles.includes(USER_ROLES_ENUM.ADMIN) || currUser.roles.includes(USER_ROLES_ENUM.SUBCOORD) || currUser.roles.includes(USER_ROLES_ENUM.COORD)) {

            const newImage = new Gallery(req.value.body);
            newImage.addedBy = currUser._id;

            newImage.save((err, product) => {
                if (err) res.status(500).send("Unable to add image!");
                else return res.status(200).send("Image added")

            });

        } else res.status(403).send("Not authorized to add images!");
    },

    deleteImageWithId: async (req, res, next) => {
        const imageId = req.params.imageId;
        const currUser = req.user;

        if (currUser.roles.includes(USER_ROLES_ENUM.ORGANIZER) || currUser.roles.includes(USER_ROLES_ENUM.ADMIN) || currUser.roles.includes(USER_ROLES_ENUM.SUBCOORD) || currUser.roles.includes(USER_ROLES_ENUM.COORD)) {
            Gallery.findByIdAndDelete(imageId, (err, doc) => {
                if (err) res.status(500).send("Unable to delete image");
                else return res.status(200).send("Image deleted.")
            })
        } else return res.status(404).send("Not authorized to delete images!!")
    },

    patchImageWithId: async (req, res, next) => {
        const imageId = req.params.imageId;
        const currUser = req.user;

        const image = await Gallery.findById(imageId);

        if (image) {
            if (currUser.roles.includes(USER_ROLES_ENUM.ORGANIZER) || currUser.roles.includes(USER_ROLES_ENUM.ADMIN) || currUser.roles.includes(USER_ROLES_ENUM.SUBCOORD) || currUser.roles.includes(USER_ROLES_ENUM.COORD)) {
                Gallery.findByIdAndUpdate(imageId, req.value.body, {
                    new: true
                }, (err, doc) => {
                    if (err) return res.status(500).send("Unable to update image");
                    else return res.status(200).send("Image updated.")
                })
            } else return res.status(403).send("Not authorized to edit image!")
        } else return res.status(404).send("Image not found!")

    },

}