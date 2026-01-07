const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
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

app.get('/api/amazon-reviews/:asin', async (req, res) => {
    const { asin } = req.params;
    const API_KEY = process.env.API_KEY;

    try {
        const response = await axios.get('https://api.openwebninja.com/realtime-amazon-data/product-reviews', {
            params: {
                asin: asin,
                country: 'US',
                sort_by: 'TOP_REVIEWS',
                page: '1',
                fields: 'review_title,review_comment,review_star_rating,review_author,review_date'
            },
            headers: {
                'x-api-key': API_KEY
            }
        });

        res.json(response.data.data.reviews || []);

    } catch (error) {
        console.error("Amazon API Error:", error.response?.data || error.message);
        res.json([]); 
    }
});

app.get('/', (req, res) => {
  res.send('Сервер працює! 🚀');
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});