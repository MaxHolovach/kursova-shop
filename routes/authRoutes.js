const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const JWT_SECRET = 'secret_key_kursova_123';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач з таким email вже існує' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'Користувача успішно створено!' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Невірний email або пароль' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Невірний email або пароль' });
    }

    const jwtToken = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.json({
        token: jwtToken,
        user: {
            _id: user._id,
            name: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        }
    });

  } catch (error) {
    console.error("Помилка при вході:", error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID  
    });
    
    const { name, email, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
        if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
        }
    } else {
        user = new User({
            username: name, 
            email: email,
            googleId: googleId,
            password: bcrypt.hashSync(Math.random().toString(36).slice(-8), 10),
            isAdmin: false
        });
        await user.save();
    }

    const jwtToken = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.json({
        token: jwtToken,
        user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(400).json({ message: "Не вдалося увійти через Google" });
  }
});

module.exports = router;