const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    idNumber: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    cart: {
        type: Array
    },
    orders: {
        type: Array
    },
    totalPrice: {
        type: Number
    }
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;