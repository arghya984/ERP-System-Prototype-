const mongoose = require('mongoose');

const manufacturingTaskSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('ManufacturingTask', manufacturingTaskSchema);
