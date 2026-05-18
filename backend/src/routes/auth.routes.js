const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  adminLoginSchema
} = require('../schemas/auth.schema');

const router = express.Router();

// Apply auth rate limiter to all login/signup actions
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/send-otp', authLimiter, validate(sendOtpSchema), authController.sendOtp);
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), authController.verifyOtp);

// Admin Custom Login Route
router.post('/admin-login', authLimiter, validate(adminLoginSchema), authController.adminLogin);

// Protected Auth Routes
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getMe);

// Route to set admin claims (Admin Only)
router.post('/set-admin-claim', authMiddleware, adminMiddleware, authController.setAdminClaim);

module.exports = router;
