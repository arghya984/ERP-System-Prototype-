const mongoose = require('mongoose');
require('dotenv').config();

const Lead = require('./models/Lead');
const Order = require('./models/Order');
const Inventory = require('./models/Inventory');
const ManufacturingTask = require('./models/ManufacturingTask');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/erp-demo';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Lead.deleteMany({});
    await Order.deleteMany({});
    await Inventory.deleteMany({});
    await ManufacturingTask.deleteMany({});

    console.log('Cleared existing data.');

    // 1. Seed Leads
    const leads = await Lead.insertMany([
      { name: 'John Doe', company: 'Tech Corp', email: 'john@techcorp.com', status: 'New' },
      { name: 'Jane Smith', company: 'Paper World', email: 'jane@paperworld.com', status: 'Converted' },
      { name: 'Robert Brown', company: 'Global Logistics', email: 'robert@globallogistics.com', status: 'Contacted' }
    ]);

    // 2. Seed Inventory
    const inventory = await Inventory.insertMany([
      { name: 'Jumbo Paper Rolls', type: 'Raw Material', quantity: 500 },
      { name: 'Uncut A4 Sheets', type: 'Raw Material', quantity: 1000 },
      { name: 'A4 Paper Reams', type: 'Finished Product', quantity: 50 },
      { name: 'GSM 55 Thermal Paper (POS Rolls)', type: 'Finished Product', quantity: 200 }
    ]);

    // 3. Seed an Order for the converted lead
    const order = await Order.create({
      leadId: leads[1]._id,
      product: 'A4 Paper Reams',
      quantity: 10,
      status: 'In Manufacturing'
    });

    // 4. Seed a Manufacturing Task for that order
    await ManufacturingTask.create({
      orderId: order._id,
      status: 'Pending'
    });

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
