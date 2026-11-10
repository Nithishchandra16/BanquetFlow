const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB & Auto-Seed if empty
connectDB().then(async () => {
  try {
    const BanquetHall = require('./models/BanquetHall');
    const count = await BanquetHall.countDocuments();
    if (count === 0) {
      console.log('[AutoSeed] Empty database detected. Populating initial BanquetFlow sample records...');
      const { seedData } = require('./seed');
      await seedData(false);
      console.log('[AutoSeed] Database initialized successfully!');
    }
  } catch (err) {
    console.warn('[AutoSeed Warning]:', err.message);
  }
});

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Root and Health check endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'BanquetFlow API Server',
    environment: process.env.NODE_ENV || 'development',
    documentation: '/api/health',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'BanquetFlow API Server',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/halls', require('./routes/hallRoutes'));
app.use('/api/catering', require('./routes/cateringRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Seed Endpoint (For initial cloud deployment & testing)
app.all('/api/seed', async (req, res) => {
  const secretKey = req.query.key || req.body?.key;
  if (secretKey !== 'banquetflow_sesd_seed_2026') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized seed trigger. Valid security key required.'
    });
  }
  try {
    const { seedData } = require('./seed');
    const result = await seedData(false);
    res.json({
      success: true,
      message: 'Database seeded successfully with initial luxury banquet halls, catering packages, and demo accounts',
      result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  BANQUETFLOW SERVER IS RUNNING ON PORT ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  API Health: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

