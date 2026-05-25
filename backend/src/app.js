// CHANGED: SEC3, P6, SEC9
// SEC3 — Enable Helmet CSP with Razorpay and Firebase Storage domains
// P6   — Restrict express.json to 1 MB default; allow 15 MB only on the base64 upload route
// SEC9 — Scope authLimiter strictly to OTP and admin-login routes (already in auth.routes.js)

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
const volunteersRoutes = require('./routes/volunteers.routes');

// Middleware Imports
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// 1. SEC3: Enable Helmet with a Content-Security-Policy that allows Razorpay + Firebase Storage
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:     ["'self'"],
      scriptSrc:      ["'self'", "'unsafe-inline'", 'https://checkout.razorpay.com', 'https://js.razorpay.com'],
      styleSrc:       ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:        ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:         ["'self'", 'data:', 'blob:', 'https://storage.googleapis.com', 'https://firebasestorage.googleapis.com'],
      connectSrc:     ["'self'", 'https://api.razorpay.com', 'https://firestore.googleapis.com', 'https://identitytoolkit.googleapis.com'],
      frameSrc:       ["'self'", 'https://api.razorpay.com'],
      objectSrc:      ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },
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

// 4. CRITICAL: Handle Webhook raw body parser BEFORE normal JSON body parser
app.use('/api/webhook', express.raw({
  type: 'application/json',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// 5. P6: Selective body parser limits
//    Upload-base64 routes are allowed up to 15 MB; everything else is limited to 1 MB.
app.use('/api/stories/gallery/upload-base64', express.json({ limit: '15mb' }));
app.use('/api/admin/stories/upload-base64', express.json({ limit: '15mb' }));
// Standard 1 MB limit for all other routes — protects against payload inflation attacks
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb', parameterLimit: 1000 }));

// 6. Security Sanitization (XSS)
app.use(xss());

// 7. General API Route Rate Limiting
app.use('/api', generalLimiter);

// 8. Route Registrations
app.use('/api/webhook', webhookRoutes);
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
app.use('/api/volunteers', volunteersRoutes);

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
