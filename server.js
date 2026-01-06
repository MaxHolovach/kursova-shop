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

mongoose.connect('mongodb+srv://fhdu888_db_user:3lZr0x4uEWlQvnth@appliancestorecluster.aq0av6u.mongodb.net/?appName=ApplianceStoreCluster') 
  .then(() => console.log('MongoDB підключено успішно'))
  .catch((err) => console.error('Помилка підключення до MongoDB:', err));

app.use('/api/products', productRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.send('Сервер працює!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});