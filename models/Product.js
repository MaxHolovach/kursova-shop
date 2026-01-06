const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  category: { // Наприклад: "fridge", "washing_machine"
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  specifications: {
    type: Map,
    of: String
  },
  inStock: {
    type: Boolean,
    default: true
  }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = { Product };