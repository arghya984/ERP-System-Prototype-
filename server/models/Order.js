const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'In Manufacturing', 'Completed'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
