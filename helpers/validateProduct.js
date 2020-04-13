const joi = require('@hapi/joi');
joi.objectId = require('joi-objectid')(joi);

const productSchema = joi.objectId({
    title: joi.string().required(),
    image: joi.string(),
    price: joi.number().integer().required(),
    details: joi.string(),
    quantity: joi.number().integer().default(0),
    isPromoted: joi.boolean().default(false),
    promotion: joi.number().integer()
});

const validateProduct = product => productSchema.validate(product, { abortEarly: false });

module.exports = validateProduct;