const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Initialize dummy inventory (for demo purposes)
router.post('/init', async (req, res) => {
  try {
    await InventoryItem.deleteMany({});
    
    const items = [
      { name: 'Thermal Jumbo Rolls', quantity: 100, type: 'Raw Material' },
      { name: 'GSM 55 Thermal Paper (POS Rolls)', quantity: 0, type: 'Finished Product' },
      { name: 'Uncut A4 Paper Rolls', quantity: 100, type: 'Raw Material' },
      { name: 'A4 Paper Reams', quantity: 0, type: 'Finished Product' }
    ];

    const inserted = await InventoryItem.insertMany(items);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update inventory item quantity manually
router.patch('/:id', async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    if (req.body.quantity !== undefined) {
      item.quantity = req.body.quantity;
      if (item.quantity < 0) item.quantity = 0;
    }
    
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create custom item
router.post('/', async (req, res) => {
  const item = new InventoryItem({
    name: req.body.name,
    quantity: req.body.quantity || 0,
    type: req.body.type
  });
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Full update item
router.put('/:id', async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
