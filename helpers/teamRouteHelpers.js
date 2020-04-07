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
}