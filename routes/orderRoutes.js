const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
  console.log("Отримано нове замовлення:", req.body);

  try {
    const { userId, products, totalPrice } = req.body;
    
    const newOrder = new Order({
      userId,
      products,
      totalPrice
    });

    const savedOrder = await newOrder.save();
    console.log("Замовлення збережено:", savedOrder._id);
    
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Помилка при створенні замовлення:", error);
    res.status(500).json({ message: "Помилка сервера при створенні замовлення" });
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