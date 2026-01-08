const express = require('express');
const router = express.Router();
const { Product } = require('../models/Product'); 

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.get('/', async (req, res) => {
    try {
        const { brand } = req.query;
        let filter = {};
        if (brand && brand !== 'Всі') {
            filter.brand = brand; 
        }
        const products = await Product.find(filter);
        
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;