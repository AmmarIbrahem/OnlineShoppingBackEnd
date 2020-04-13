const mongoose = require('mongoose');


//Products (id,
// title, image, price, details,
// quantity, ispromoted, promotion)

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    details: {
        type: String
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    isPromoted: {
        type: Boolean,
        default: false
    },
    promotion: {
        type: Number
    }
})
const Product = mongoose.model('Product', productSchema);
module.exports = Product;