const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

router.get('/:asin', async (req, res) => {
  try {
    const comments = await Comment.find({ asin: req.params.asin }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const { asin, userId, username, text, rating } = req.body; 
  try {
    const newComment = new Comment({ asin, userId, username, text, rating }); 
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;