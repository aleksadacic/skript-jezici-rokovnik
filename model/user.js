const Joi = require('joi');

const signatureShema = Joi.object().keys({
    // iduser: Joi.string().alphanum().required(), id autoincrement
    username: Joi.string().trim().min(4).max(16).required().alphanum()
});

module.exports = signatureShema;