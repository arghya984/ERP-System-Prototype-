const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Lead = require('../models/Lead');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('leadId').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create an order
router.post('/', async (req, res) => {
  const order = new Order({
    leadId: req.body.leadId,
    product: req.body.product,
    quantity: req.body.quantity,
    status: req.body.status || 'Pending'
  });

  try {
    const newOrder = await order.save();
    
    // Update lead status to Converted
    if (req.body.leadId) {
      await Lead.findByIdAndUpdate(req.body.leadId, { status: 'Converted' });
    }

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update order status
router.patch('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (req.body.status) order.status = req.body.status;
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Full update order
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
