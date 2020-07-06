const mongoose = require('mongoose');




const ProductsSchema = new mongoose.Schema({
    sizeInStock: {
        type: Array,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    onSale: {
        type: Boolean,
        required: true
    },
    code: {
        type: Number,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }

});

const CateorySchema = new mongoose.Schema({

    name: [ProductsSchema]
});

const ProductsModel = mongoose.model('products', ProductsSchema);

module.exports = ProductsModel;