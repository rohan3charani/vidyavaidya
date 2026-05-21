const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
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
const testimonialsRoutes = require('./routes/testimonials.routes');
const adminRoutes = require('./routes/admin.routes');
const communityRoutes = require('./routes/community.routes');
const webhookRoutes = require('./routes/webhook.routes');
const foreignDonorsRoutes = require('./routes/foreign-donors.routes');

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
    // Also allow any localhost or 127.0.0.1 origin for flexible development
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
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

// 5. Standard Body Parsers (with size limits increased to 50mb for base64 file uploads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));

// 6. Security Sanitizations (XSS)
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
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/foreign-donors', foreignDonorsRoutes);

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
