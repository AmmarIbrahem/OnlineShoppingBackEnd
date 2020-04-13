const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const orderStatus = require('./OrderStatus');

const orderSchema = new mongoose.Schema({
    // Display userName
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // Display titles name
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    }],
    productCount: [{
        type: Number,
        required: true
    }],
    date: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: orderStatus.pending
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;