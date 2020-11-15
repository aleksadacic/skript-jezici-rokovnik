const Joi = require('joi');

const todosShema = Joi.object().keys({
    time: Joi.string().trim().required(),
    date: Joi.date().raw().error(() => "date error"),
    text: Joi.string().trim().max(40).required(),
    iduser: Joi.number().required(),
    done: Joi.bool().required()
});

module.exports = todosShema;