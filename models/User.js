const mongoose = require("mongoose");
//TODO : password should be hashed

//Schema with validations
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 15
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 15,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    role: {
        type: String,
        enum: ['member', 'admin']
    },
    imageUrl: String,
    //Relationship
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
});

//Export
module.exports = mongoose.model('User', userSchema);