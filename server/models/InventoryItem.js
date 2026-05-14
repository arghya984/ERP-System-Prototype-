const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  type: { type: String, enum: ['Raw Material', 'Finished Product'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
