const Joi = require('joi');

const signatureShema = Joi.object().keys({
    name: Joi.string().trim().min(1).max(16).required().alphanum(),
    password: Joi.string().min(1).max(25).required()
});

module.exports = signatureShema;