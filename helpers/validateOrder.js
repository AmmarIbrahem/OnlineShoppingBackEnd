const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const orderSchema = Joi.object({
    user: Joi.objectId().required(),
    products: Joi.array().items(Joi.objectId()).default([]),
    productCount: Joi.array().items(Joi.number().integer()).default([])
});

const validateOrder = order => orderSchema.validate(order, { abortEarly: false });

module.exports = validateOrder;