const Joi = require('joi');

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

    schemas: {
        insertSchema: Joi.object().keys({
            name: Joi.string().required(),
            imageUrl: Joi.string().required(),
            category: Joi.string().required(),
            website: Joi.string()
        }).unknown(false),
        patchSchema: Joi.object().keys({
            name: Joi.string(),
            imageUrl: Joi.string(),
            category: Joi.string(),
            website: Joi.string()
        }).unknown(false),
    }
}