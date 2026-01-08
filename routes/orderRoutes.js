const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
  try {
    const { userId, items, totalAmount, username } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Немає даних для замовлення (userId або товари)' });
    }

    const newOrder = new Order({
      userId,
      username: username || 'Анонім',
      items: items.map(item => ({
        title: item.title || item.name || item.product_title, 
        quantity: item.quantity,
        price: item.price || item.product_price,
        image: item.image || item.product_photo
      })),
      totalAmount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);

  } catch (error) {
    console.error("Помилка при створенні замовлення:", error);
    res.status(500).json({ message: 'Помилка сервера при оформленні замовлення' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;