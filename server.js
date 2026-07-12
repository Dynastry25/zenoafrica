import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Backend Route Imports (CommonJS via createRequire) ─────
const authRoutes = require('./backend/src/routes/auth.routes');
const userRoutes = require('./backend/src/routes/user.routes');
const packageRoutes = require('./backend/src/routes/package.routes');
const bookingRoutes = require('./backend/src/routes/booking.routes');
const paymentRoutes = require('./backend/src/routes/payment.routes');
const visaRoutes = require('./backend/src/routes/visa.routes');
const hotelRoutes = require('./backend/src/routes/hotel.routes');
const flightRoutes = require('./backend/src/routes/flight.routes');
const reviewRoutes = require('./backend/src/routes/review.routes');
const notificationRoutes = require('./backend/src/routes/notification.routes');
const adminRoutes = require('./backend/src/routes/admin.routes');
const uploadRoutes = require('./backend/src/routes/upload.routes');
const contactRoutes = require('./backend/src/routes/contact.routes');
const errorHandler = require('./backend/src/middleware/error.middleware');

const app = express();

// ─── Database Connection ────────────────────────────────────
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('✅ MongoDB Atlas Connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
}

// ─── General Middleware ─────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Security Middleware ────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts. Please try again later.' },
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));

// ─── API Routes ─────────────────────────────────────────────
const API = '/api';
app.use(`${API}/auth`, authRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/packages`, packageRoutes);
app.use(`${API}/bookings`, bookingRoutes);
app.use(`${API}/payments`, paymentRoutes);
app.use(`${API}/visa`, visaRoutes);
app.use(`${API}/hotels`, hotelRoutes);
app.use(`${API}/flights`, flightRoutes);
app.use(`${API}/reviews`, reviewRoutes);
app.use(`${API}/notifications`, notificationRoutes);
app.use(`${API}/admin`, adminRoutes);
app.use(`${API}/upload`, uploadRoutes);
app.use(`${API}/contact`, contactRoutes);

// ─── Health Check ───────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Zeno Africa Adventures API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─── Serve Frontend Build ───────────────────────────────────
const frontendBuild = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendBuild));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuild, 'index.html'));
});

// ─── Error Handler ──────────────────────────────────────────
app.use(errorHandler);

// ─── Connect DB then Start Server (local dev only) ──────────
if (!process.env.VERCEL) {
  mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB Atlas Connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n🚀 Zeno Africa Adventures API`);
      console.log(`   Running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
      console.log(`   Health: http://localhost:${PORT}/health\n`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
}

export default app;
