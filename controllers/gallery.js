const Gallery = require('../models/gallery')

module.exports = {

    getAllImages: async (req, res, next) => {
        const images = await Gallery.find({}, 'caption imageUrl thumbnailUrl');
        res.status(200).json({
            data: images,
            message: images.length + ' images found.'
        })
    },

    getImageById: async (req, res, next) => {
        const imageId = req.params.imageId;
        const image = await Gallery.findById(imageId);

        if (image) res.status(200).json({
            data: image
        });
        else return res.status(404).json({
            message: "Image not found"
        });
    },

    postImage: async (req, res, next) => {
        const currUser = req.user;

        const newImage = new Gallery(req.value.body);
        newImage.addedBy = currUser._id;

        newImage.save((err, product) => {
            if (err) res.status(500).json({
                message: "Unable to add image!",
                error: err
            });
            else return res.status(200).json({
                message: "Image added",
                data: product
            })

        });
    },

    deleteImageWithId: async (req, res, next) => {
        const imageId = req.params.imageId;
        Gallery.findByIdAndDelete(imageId, (err, doc) => {
            if (err) res.status(500).json({
                message: "Unable to delete image!",
                error: err
            });
            else return res.status(200).json({
                message: "Image deleted."
            })
        })
    },

    patchImageWithId: async (req, res, next) => {
        const imageId = req.params.imageId;

        Gallery.findByIdAndUpdate(imageId, req.value.body, {
            new: true
        }, (err, doc) => {
            if (err) return res.status(500).json({
                message: "Unable to update image!",
                error: err
            });
            else return res.status(200).json({
                message: "Image updated.",
                data: doc
            })
        })
    },

}