import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const authRoutes = require('../backend/src/routes/auth.routes');
const userRoutes = require('../backend/src/routes/user.routes');
const packageRoutes = require('../backend/src/routes/package.routes');
const bookingRoutes = require('../backend/src/routes/booking.routes');
const paymentRoutes = require('../backend/src/routes/payment.routes');
const visaRoutes = require('../backend/src/routes/visa.routes');
const hotelRoutes = require('../backend/src/routes/hotel.routes');
const flightRoutes = require('../backend/src/routes/flight.routes');
const reviewRoutes = require('../backend/src/routes/review.routes');
const notificationRoutes = require('../backend/src/routes/notification.routes');
const adminRoutes = require('../backend/src/routes/admin.routes');
const uploadRoutes = require('../backend/src/routes/upload.routes');
const contactRoutes = require('../backend/src/routes/contact.routes');
const errorHandler = require('../backend/src/middleware/error.middleware');

const app = express();

let dbReady = null;
function connectDB() {
  if (!dbReady) {
    dbReady = mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI).then(() => {
      console.log('✅ MongoDB Atlas Connected');
      return mongoose;
    });
  }
  return dbReady;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    res.status(503).json({ success: false, message: 'Database unavailable' });
  }
});

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

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

app.use(mongoSanitize());

app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests.' },
}));

app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts.' },
}));
app.use('/api/auth/register', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts.' },
}));

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

app.get('/health', async (req, res) => {
  await connectDB();
  res.status(200).json({
    success: true,
    message: 'Zeno Africa Adventures API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

export default function handler(req, res) {
  return app(req, res);
}
