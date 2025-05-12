const mongoose = require('mongoose');

const clothesSchema = new mongoose.Schema({
  // 🧥 Clothing Item Details
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Uncategorized',
    trim: true
  },
  size: {
    type: String,
    default: 'Free Size',
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']
  },
  brand: {
    type: String,
    default: 'Generic',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  // 🧾 Order Details
  orderId: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  items: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  orderDate: {
    type: String,
    default: new Date().toISOString().split('T')[0]
  },
  paymentMethod: {
    type: String,
    default: 'COD'
  },
  paymentId: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Clothes', clothesSchema);
