const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [
        {
            name: String,
            price: Number,
            image: String,
            qty: { type: Number, default: 1 }
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "В обробці" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);