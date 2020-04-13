const express = require('express');

const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const validateOrder = require('../helpers/validateOrder');
const validateObjectId = require('../helpers/validateObjectId');
const orderStatus = require('../models/OrderStatus');
const router = express.Router();

// Get All Orders
router.get('/', async (request, response) => {
    const orders = await Order.find({}).populate('user').populate('products');
    response.send(orders);
});

// Get Order By ID
router.get('/:id', async (request, response) => {
    const { id } = request.params;
    const { error } = validateObjectId(id);
    if (error) {
        return response.status(400).send('Invalid Order Id');
    }
    const order = await Order.findById(id).populate('user').populate('products');
    if (!order) {
        return response.status(400).send('Order Not Found');
    }
    response.send(order);
});

// Add Order
router.post('/', async (request, response) => {
    const { error } = validateOrder(request.body);
    if (error) {
        return response.status(400).send(error.details);
    }
    let order = new Order({
        ...request.body
    });
    order.status = orderStatus.pending;

    if (order.productCount.length !== order.products.length)
        return response.status(400).send("Invalid counts for products");

    const productsToBeUpdated = [];
    for (let i = 0; i < order.products.length; i++) {
        let product = await Product.findById(order.products[i]);
        if (order.productCount[i] <= product.quantity) {
            product.quantity -= order.productCount[i];
            productsToBeUpdated.push(product);
        } else {
            return response.status(400).send("Not Enough products");
        }
    }

    productsToBeUpdated.forEach(async (product) => {
        product =
            await Product.findByIdAndUpdate(product._id, product);
    });

    order = await order.save();
    const user = await User.findById(order.user);
    user.orders.push(order._id);
    // user = await User.findByIdAndUpdate(user._id, user);
    user.save();
    response.send(order);
});

// Update Order
router.patch('/:id', async (request, response) => {
    const { id } = request.params;
    const { error } = validateObjectId(id);
    if (error) {
        return response.status(400).send('Invalid Order Id');
    }
    await Order.findOneAndUpdate(id, request.body, (error) => {
        if (error) return response.send(500, { error: error });
        return response.send("Successfully Saved");
    });
});

// Delete Order
router.delete("/:id", async (request, response) => {
    const { id } = request.params;
    const { error } = validateObjectId(id);
    if (error) {
        return res.status(400).send('Invalid Order');
    }
    const order = await Order.findById(id).populate('products');
    if (!order) {
        return response.status(400).send('Order Not Found');
    }
    if (order.status === orderStatus.pending) {
        return response.status(400).send('Can not Delete Pending Order');
    }

    for (let i = 0; i < order.products.length; i++) {
        let product = await Product.findById(order.products[i]);
        product.quantity += order.productCount[i];
        product = await Product.findByIdAndUpdate(product._id, product);
    }
    await Order.findByIdAndDelete(id);
    response.send("Deleted");
});

module.exports = router;
