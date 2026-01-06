const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'secret_key_kursova_123'; // Секретний ключ

// --- РЕЄСТРАЦІЯ ---
// Шлях: POST /api/auth/register
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

// --- ВХІД (LOGIN) ---
// Шлях: POST /api/auth/login (Зверни увагу: тут просто '/login')
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Шукаємо користувача
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Невірний email або пароль' });
    }

    // 2. Перевіряємо пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Невірний email або пароль' });
    }

    // 3. Генеруємо токен
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4. Віддаємо результат
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Помилка при вході:", error); // Вивід помилки в термінал
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;