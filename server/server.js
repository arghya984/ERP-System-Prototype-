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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/erp-demo')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
