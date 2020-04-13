const express = require('express');
const userRouter = express.Router();
const UserModel = require('../models/User');
const OrderModel = require('../models/Order');
const ProductModel = require('../models/Product');
const orderStatusModel = require('../models/OrderStatus');
const validateUser = require('../helpers/validateUser');
const validateObjectId = require('../helpers/validateObjectId');

//Get All
userRouter.get('/', async (req, res) => {
    let usersFromDb = await UserModel.find({}).populate('orders');
    if (usersFromDb) res.send(usersFromDb);
    else res.send('No Data');
});

//Get Specific User
userRouter.get('/:id', async (req, res) => {
    const { error } = validateObjectId(req.params.id);
    if (error) return res.status(400).send('Invalid Id');
    let usersFromDb = await UserModel.findById(req.params.id).populate('orders');
    if (usersFromDb) res.send(usersFromDb);
    else res.send('No Data');
});

//Add New User
userRouter.post('/', async (req, res) => {
    //Validation
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send('Cannot perform this operation, check this error', error);
    //Save to db
    else {
        let userObj = new UserModel({
            ...req.body
        });
        userObj.role = 'member';
        if (!req.body.imageUrl) userObj.imageUrl = '';
        if (!req.body.orders) userObj.orders = [];
        userObj = await userObj.save();
        //Return response
        if (await userObj.save())
            res.send(userObj);
        else res.send('Failed to add this user');
    }
});

//Update User By Id
userRouter.patch('/:id', async (req, res) => {
    //Find User
    const userObjToUpdate = req.body;
    const id = req.params.id;
    let userFromDb = UserModel.findById(id);
    //Validate Id
    const { error } = validateObjectId(id);
    if (error) return res.status(400).send('Invalid Id');
    //Save to db
    await UserModel.findByIdAndUpdate(id, userObjToUpdate);
    return res.status(200).send(userObjToUpdate);
});

//Delete User By Id
userRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const { error } = validateObjectId(id);
    if (error) return res.status(400).send('Invalid User Id');
    const userOrders = await OrderModel.populate('Products').find({ 'user': id, 'status': orderStatusModel.pending });
    for (let i = 0; i < order.products.length; i++) {
        let product = await ProductModel.findById(order.products[i]);
        product.quantity += order.productCount[i];
        product = await Product.findByIdAndUpdate(product._id, product);
    }
    const user = await UserModel.findByIdAndDelete(id);
    await UserModel.deleteMany({ user: user.id });
    return res.status(200).send('User deleted');
});

module.exports = userRouter;