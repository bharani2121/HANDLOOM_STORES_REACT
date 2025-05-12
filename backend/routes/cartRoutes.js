const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// GET cart items for a user (populating clothes info)
router.get('/:userId', async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId }).populate('clothesId');

    const formattedItems = cartItems.map(item => ({
      _id: item._id,
      quantity: item.quantity,
      clothing: item.clothesId,  // We're keeping this as "clothing" to match the frontend
    }));

    res.json(formattedItems);
  } catch (err) {
    console.error('❌ Error fetching cart:', err);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// POST add item to cart
router.post('/', async (req, res) => {
  const { userId, clothesId, quantity } = req.body;

  try {
    // Check if item already exists in cart
    const existing = await Cart.findOne({ userId, clothesId });

    if (existing) {
      existing.quantity += quantity || 1;
      await existing.save();
      return res.status(200).json(existing);
    }

    const cartItem = new Cart({
      userId,
      clothesId,
      quantity: quantity || 1,
    });

    const savedItem = await cartItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('❌ Error adding to cart:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// PUT update quantity
router.put('/:id', async (req, res) => {
  const { quantity } = req.body;

  try {
    const cartItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(cartItem);
  } catch (err) {
    console.error('❌ Error updating cart item:', err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// DELETE remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Cart.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('❌ Error deleting cart item:', err);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
});

module.exports = router;