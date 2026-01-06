const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/myorders', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
    const {
        userId,
        items,
        shippingAddress,
        totalAmount
    } = req.body;

    if (items && items.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    } else {
        const order = new Order({
            user: userId,
            orderItems: items.map(item => ({
                product: item._id, // ASIN з Amazon
                name: item.name,
                qty: item.quantity || 1, // Переконайся, що у CartContext є quantity
                image: item.image,       // Важливо: в Cart.jsx у тебе було item.imageUrl, перевір це!
                price: item.price
            })),
            shippingAddress: shippingAddress,
            totalPrice: totalAmount
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});

module.exports = router;