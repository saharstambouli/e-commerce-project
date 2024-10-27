const { ObjectId } = require('mongodb'); 
const Product = require('../models/Product_schema');

const productCtrl = {
    upload: async (req, res) => {
        try {
            const products = await Product.find(); 
            res.status(200).json(products);        
        } catch (error) {
            res.status(500).json({ message: 'Error fetching products', error });
        }
    }, 

    getProductById: async (req, res) => {
        const { productId } = req.params;  // Get productId from URL params
        try {
            // Convert the string to ObjectId
            const product = await Product.findById(productId);  
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(product);        
        } catch (error) {
            res.status(500).json({ message: 'Error fetching product', error });
        }
    },

    deleteProduct: async (req, res) => {
        const { productId, quantity } = req.body; 
        console.log('Received request body:', req.body); // Add this line // Expecting product ID and quantity to be purchased from front-end

        try {
            // Find the product by ID
            const product = await Product.findById(productId);
    
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            // Check if the stock is sufficient
            if (product.stock < quantity) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }
    
            // Deduct the purchased quantity from stock
            product.stock -= quantity;
    
            // // If stock goes to 0 and you want to delete the product (optional)
            // if (product.stock === 0) {
            //     await product.remove();
            //     return res.status(200).json({ message: 'Product sold out and removed from database' });
            // }
    
            // Otherwise, save the updated product with the new stock
            await product.save();
    
            return res.status(200).json({ message: 'Purchase successful', updatedProduct: product });
    
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
            console.error(error)
        }
},
}

module.exports = productCtrl;
