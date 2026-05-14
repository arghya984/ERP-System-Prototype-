const express = require('express');
const router = express.Router();
const ManufacturingTask = require('../models/ManufacturingTask');
const Order = require('../models/Order');
const InventoryItem = require('../models/InventoryItem');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await ManufacturingTask.find().populate('orderId').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a task
router.post('/', async (req, res) => {
  const task = new ManufacturingTask({
    orderId: req.body.orderId,
    status: req.body.status || 'Pending'
  });

  try {
    const newTask = await task.save();

    // Update order status
    if (req.body.orderId) {
      await Order.findByIdAndUpdate(req.body.orderId, { status: 'In Manufacturing' });
    }

    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update task status (The Golden Path logic)
router.patch('/:id', async (req, res) => {
  try {
    const task = await ManufacturingTask.findById(req.params.id).populate('orderId');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    const oldStatus = task.status;
    if (req.body.status) task.status = req.body.status;
    
    const updatedTask = await task.save();

    // If status changed to 'Completed', update inventory
    if (oldStatus !== 'Completed' && req.body.status === 'Completed') {
      // 1. Update order status
      await Order.findByIdAndUpdate(task.orderId, { status: 'Completed' });

      // 2. Decrement raw material
      const rawMaterial = await InventoryItem.findOne({ type: 'Raw Material' });
      if (rawMaterial) {
        rawMaterial.quantity -= task.orderId.quantity; // assuming 1:1 for demo
        if(rawMaterial.quantity < 0) rawMaterial.quantity = 0;
        await rawMaterial.save();
      }

      // 3. Increment finished product
      const finishedProduct = await InventoryItem.findOne({ type: 'Finished Product' });
      if (finishedProduct) {
        finishedProduct.quantity += task.orderId.quantity;
        await finishedProduct.save();
      }
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
