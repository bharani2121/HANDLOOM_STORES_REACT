const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User'); // Assuming you have a User model

// GET next order ID
router.get('/next-id', async (req, res) => {
  try {
    const nextOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    res.json({ nextOrderId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate order ID' });
  }
});

// CREATE a new order
router.post('/create', async (req, res) => {
  try {
    const { orderId, username, phone, address, items, quantity, totalAmount, orderDate, paymentMethod, paymentId } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const orderItems = items.map(item => ({
      clothingItem: item.clothing._id,
      name: item.clothing.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.clothing.price
    }));

    const newOrder = new Order({
      orderId,
      user: user._id,
      items: orderItems,
      shippingInfo: {
        fullName: username,
        phone,
        address
      },
      totalAmount,
      paymentMethod,
      transactionId: paymentId || null,
      orderStatus: "Pending",
      createdAt: orderDate
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});

module.exports = router;
