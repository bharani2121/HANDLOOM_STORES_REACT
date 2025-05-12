const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clothesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clothes',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  }
});

module.exports = mongoose.model('Cart', cartSchema);
