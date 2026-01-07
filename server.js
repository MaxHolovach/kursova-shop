const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

console.log("--------------------------------------");
console.log("🔍 ПЕРЕВІРКА ЗМІННИХ:");
console.log("🔑 API KEY:", process.env.API_KEY ? "Є (Починається на " + process.env.API_KEY.substring(0, 5) + ")" : "❌ НЕМАЄ (UNDEFINED)");
console.log("🔑 GOOGLE ID:", process.env.GOOGLE_CLIENT_ID ? "Є" : "❌ НЕМАЄ");
console.log("--------------------------------------");

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

app.get('/api/amazon-search', async (req, res) => {
    const { query, page } = req.query;
    const API_KEY = process.env.API_KEY; 

    try {
        const response = await axios.get('https://api.openwebninja.com/realtime-amazon-data/search', {
            params: {
                query: query,
                page: page || '1',
                country: 'US',
                sort_by: 'RELEVANCE',
                product_condition: 'ALL'
            },
            headers: {
                'x-api-key': API_KEY 
            }
        });

        res.json(response.data.data.products || []);

    } catch (error) {
        console.error("Search API Error:", error.response?.data || error.message);
        res.json([]);
    }
});

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
        console.error("Reviews API Error:", error.response?.data || error.message);
        res.json([]);
    }
});

app.get('/', (req, res) => {
  res.send('Сервер працює! 🚀');
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});