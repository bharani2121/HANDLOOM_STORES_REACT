const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    clothingItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clothing',
      required: true
    },
    name: String,
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    color: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  shippingInfo: {
    fullName: String,
    phone: String,
    address: String
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online'],
    default: 'COD'
  },
  transactionId: {
    type: String,
    default: null
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Generate a unique order ID before saving
orderSchema.pre('save', function(next) {
  if (!this.orderId) {
    this.orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
