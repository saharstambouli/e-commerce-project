const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
 
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String,  
        required: true
    },
    category: {
        type: String,  
        required: true
    },
    stock: {
        type: Number,  
        required: true
    }


}, { timestamps: true });

const Product = mongoose.model('Product', productSchema, 'Products');

module.exports = Product;
