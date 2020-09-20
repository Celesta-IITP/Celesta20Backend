const Joi = require("joi");

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json(result.error);
      }
      if (!req.value) {
        req.value = {};
      }
      req.value["body"] = result.value;
      next();
    };
  },

  //valiadtion schemas
  schemas: {
    authSchemaSignIn: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
    authSchemaSignUp: Joi.object()
      .keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        name: Joi.string().required(),
        phone: Joi.string().required(),
        college: Joi.string().required(),
        sex: Joi.number().required(),
        referralId: Joi.string().optional(),
      })
      .unknown(false),
    userSchemaPatch: Joi.object().keys({}),
  },
};
