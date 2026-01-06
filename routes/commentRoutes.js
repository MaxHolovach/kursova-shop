const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

router.get('/:productId', async (req, res) => {
  try {
    const comments = await Comment.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { productId, userName, text, rating } = req.body; 

  if (!text || !productId) {
      return res.status(400).json({ message: "Текст коментаря обов'язковий" });
  }

  const comment = new Comment({
    productId,
    userName: userName || "Гість",
    text,
    rating: rating || 5
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;