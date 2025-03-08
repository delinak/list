const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:19006', 'exp://localhost:19000', 'http://10.0.2.2:19000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());
app.use(express.json());

// Import routes
const entryRoutes = require('./routes/entryRoutes');
const listRoutes = require('./routes/listRoutes');

// Use routes
app.use('/entry', entryRoutes);
app.use('/list', listRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 