const Gallery = require('../models/gallery')

module.exports = {

    getAllImages: async (req, res, next) => {
        const images = await Gallery.find({}, 'caption imageUrl thumbnailUrl');
        res.status(200).json({ data: images })
    },

    getImageById: async (req, res, next) => {
        const imageId = req.params.imageId;
        const image = await Gallery.findById(imageId);

        if (image) res.status(200).json({ data: image });
        else return res.status(404).json({ message: "IMage not found" });
    },

    postImage: async (req, res, next) => {
        const currUser = req.user;

        if (currUser.roles.includes(USER_ROLES_ENUM.ORGANIZER) || currUser.roles.includes(USER_ROLES_ENUM.ADMIN) || currUser.roles.includes(USER_ROLES_ENUM.SUBCOORD) || currUser.roles.includes(USER_ROLES_ENUM.COORD)) {

            const newImage = new Gallery(req.value.body);
            newImage.addedBy = currUser._id;

            newImage.save((err, product) => {
                if (err) res.status(500).json({ message: "Unable to add image!" });
                else return res.status(200).json({ message: "Image added" })

            });

        } else res.status(403).json({ message: "Not authorized to add images!" });
    },

    deleteImageWithId: async (req, res, next) => {
        const imageId = req.params.imageId;
        const currUser = req.user;

        if (currUser.roles.includes(USER_ROLES_ENUM.ORGANIZER) || currUser.roles.includes(USER_ROLES_ENUM.ADMIN) || currUser.roles.includes(USER_ROLES_ENUM.SUBCOORD) || currUser.roles.includes(USER_ROLES_ENUM.COORD)) {
            Gallery.findByIdAndDelete(imageId, (err, doc) => {
                if (err) res.status(500).json({ message: "Unable to delete image" });
                else return res.status(200).json({ message: "Image deleted." })
            })
        } else return res.status(404).json({ message: "Not authorized to delete images!!" })
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
                    if (err) return res.status(500).json({ message: "Unable to update image" });
                    else return res.status(200).json({ message: "Image updated." })
                })
            } else return res.status(403).json({ message: "Not authorized to edit image!" })
        } else return res.status(404).json({ message: "Image not found!" })

    },

}