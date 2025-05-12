const express = require('express');
const router = express.Router();
const Clothes = require('../models/clothes');
const Cart = require('../models/Cart');

// GET all clothes
router.get('/', async (req, res) => {
  try {
    const clothes = await Clothes.find();
    res.json(clothes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single clothing item by ID
router.get('/:id', async (req, res) => {
  try {
    const clothing = await Clothes.findById(req.params.id);
    if (!clothing) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(clothing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Add a new clothing item
router.post('/', async (req, res) => {
  try {
    const newClothing = new Clothes(req.body);
    await newClothing.save();
    res.status(201).json(newClothing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Update a clothing item
router.put('/:id', async (req, res) => {
  try {
    const updatedClothing = await Clothes.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedClothing) {
      return res.status(404).json({ message: 'Clothing item not found' });
    }
    res.status(200).json(updatedClothing);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Delete a clothing item and its references in Cart
router.delete('/:id', async (req, res) => {
  const clothingId = req.params.id;
  try {
    console.log("🧹 Deleting clothing item with ID:", clothingId);

    // Delete cart entries with matching clothesId
    const deleteCartResult = await Cart.deleteMany({ clothesId: clothingId });
    console.log(`🛒 Deleted ${deleteCartResult.deletedCount} related cart items`);

    // Delete the clothing item
    const deletedClothing = await Clothes.findByIdAndDelete(clothingId);
    if (!deletedClothing) {
      return res.status(404).json({ message: 'Clothing item not found' });
    }

    res.status(200).json({
      message: '✅ Clothing item and related cart entries deleted successfully',
    });
  } catch (err) {
    console.error('❌ Error deleting clothing item:', err);
    res.status(500).json({
      message: 'Failed to delete clothing item',
      error: err.message,
    });
  }
});

module.exports = router;
