const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const commentRoutes = require('./routes/commentRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.error('MongoDB Error ❌:', err));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.send('Сервер працює! 🚀');
});

// --- ЗАПУСК ---
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});