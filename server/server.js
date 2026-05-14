const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leads', require('./routes/leads'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/manufacturing', require('./routes/manufacturing'));
app.use('/api/inventory', require('./routes/inventory'));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/erp-demo';
const isAtlas = MONGODB_URI.includes('mongodb+srv');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log(`✅ Connected to MongoDB [${isAtlas ? '☁️  Atlas (Cloud)' : '💻 Local'}]`);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
