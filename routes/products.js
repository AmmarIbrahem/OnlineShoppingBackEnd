const express = require('express');

const Product = require('../models/Product');

const validateProduct = require('../helpers/validateProduct');
const validateObjectId = require('../helpers/validateObjectId');

const router = express.Router();

//  GetAll products
//  GET /Products
router.get('/', async (req, res) => {
    const products = await Product.find({});
    res.send(products);
});
//  Get Product by ID
//  GET /products/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const { err } = validateObjectId(id);
    if (err)
        return res.status(400).send('Invalid Product ID');
    const product = await Product.findById(id);
    if (!product)
        return res.status(404).send("Product not Found");
    res.send(product);
});

//  INSERT product
//  POST /products
router.post('/', async (req, res) => {
    const { err } = validateProduct(req.body);
    if (err)
        return res.status(400).send(err.details);
    let product = new Product({
        ...req.body
    });
    product = await product.save();
    res.send(product);
});

//  Update product by ID
//  PATCH products/:id
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { errId } = validateObjectId(id);
    const { errProduct } = validateProduct(req.body);

    if (errId)
        return res.status(400).send('Invalid Product Id');
    if (errProduct)
        return res.status(404).send(errProduct.details);
    let product = { ...req.body };
    product = await Product.findByIdAndUpdate(id, product);
    if (!product)
        return res.status(404).send('Product Update Failed');
    return res.status(200).send('Product Info updated')
});

//  Delete product by ID
//  DELETE products/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { err } = validateObjectId(id);
    if (err)
        return res.status(400).send('Invalid Product Id');
    const product = await Product.findByIdAndDelete(id);
    if (!product)
        return res.status(404).send('Product not Found');
    console.log(product);
    return res.status(200).send('Product is Deleted');
});

module.exports = router;
