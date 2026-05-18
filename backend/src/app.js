const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');

// Route Imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const donateRoutes = require('./routes/donate.routes');
const paymentRoutes = require('./routes/payment.routes');
const eventsRoutes = require('./routes/events.routes');
const storiesRoutes = require('./routes/stories.routes');
const contactRoutes = require('./routes/contact.routes');
const partnersRoutes = require('./routes/partners.routes');
const adminRoutes = require('./routes/admin.routes');
const communityRoutes = require('./routes/community.routes');
const webhookRoutes = require('./routes/webhook.routes');

// Middleware Imports
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// 1. Enable Helmet for Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // configured dynamically based on deployment
  hsts: { maxAge: 31536000, includeSubDomains: true }
}));

// 2. Configure CORS Origin Whitelisting
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://vidyavaidya.org',
  'https://www.vidyavaidya.org'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or local testing requests (undefined origins)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy: Request origin not whitelisted'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 3. Logger (Morgan - HTTP Access Log)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// 4. CRITICAL: Handle Webhook raw body parser before normal JSON body parser
app.use('/api/webhook', express.raw({
  type: 'application/json',
  verify: (req, res, buf) => {
    // Store original raw string of body for HMAC verifying in webhook controller
    req.rawBody = buf.toString();
  }
}));

// 5. Standard Body Parsers (with size limits)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 6. Security Sanitizations (NoSQL Injection & XSS)
app.use(mongoSanitize());
app.use(xss());

// 7. General API Route Rate Limiting
app.use('/api', generalLimiter);

// 8. Route Registrations
app.use('/api/webhook', webhookRoutes); // Mount webhook router
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/donate', donateRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/community', communityRoutes);

// Base Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Vidyavaidya Backend Service is live and active'
  });
});

// 9. Global Express Centralized Error Handler
app.use(errorHandler);

module.exports = app;
