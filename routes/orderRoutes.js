const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
  try {
    console.log("Отримано замовлення:", req.body);

    const { userId, products, totalPrice, recipientName, shippingAddress, phone } = req.body;
    
    if (!recipientName || !shippingAddress || !phone) {
        return res.status(400).json({ message: "Будь ласка, заповніть всі поля доставки" });
    }
    const formattedProducts = products.map(item => ({
        _id: item._id, 
        name: item.name,
        price: item.price,
        image: item.image,
        qty: item.qty || 1
    }));

    const newOrder = new Order({
      userId,
      recipientName,   
      shippingAddress, 
      phone,           
      products: formattedProducts,
      totalPrice
    });

    const savedOrder = await newOrder.save();
    console.log("Успішно збережено!");
    res.status(201).json(savedOrder);

  } catch (error) {
    console.error("ПОМИЛКА СЕРВЕРА:", error);
    res.status(500).json({ message: error.message });
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