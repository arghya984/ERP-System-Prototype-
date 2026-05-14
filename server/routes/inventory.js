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
      { name: 'GSM 55 Thermal Paper (POS Rolls)', quantity: 0, type: 'Finished Product' }
    ];

    const inserted = await InventoryItem.insertMany(items);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
