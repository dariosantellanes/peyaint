const Joi = require('@hapi/joi');

const schema = Joi.object({
    id: Joi.number().required(),
    state: Joi.string().required(),
    pickup: Joi.boolean().required(),
    notes: Joi.string().required(),
    registeredDate: Joi.date().required(),
    integration: Joi.string().required(),
    customer: Joi.object({
        id: Joi.number().integer().required(),
        name: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required()
    }).required(),
    address: Joi.object({
        description: Joi.string().required(),
        coordinates: Joi.string().required(),
        phone: Joi.number().integer().required(),
    }).required(),
    restaurant: Joi.object({
        id: Joi.number().integer().required(),
        name: Joi.string().required(),
    }).required(),
    total: Joi.number().integer().required(),
    shipping: Joi.number().integer().required(),
    subtotal: Joi.number().integer().required(),
    items: Joi.array().items(
        Joi.object({
            id: Joi.number().integer(),
            total: Joi.number().integer(),
            quantity: Joi.number().integer(),
            name: Joi.string(),
            options: Joi.array().items(
                Joi.object({
                    id: Joi.number().integer(),
                    name: Joi.string(),
                    quantity: Joi.number().integer(),
                }))
        }))
});

module.exports = function (data) {
    return schema.validate(data);

};