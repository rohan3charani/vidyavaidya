const express = require('express');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { paymentLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { createOrderSchema } = require('../schemas/donate.schema');

const router = express.Router();

// Define a middleware that verifies authentication if present, but allows guests to proceed
const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  return authMiddleware(req, res, next);
};

router.post('/create-order', optionalAuthMiddleware, paymentLimiter, validate(createOrderSchema), paymentController.createOrder);
router.post('/create-subscription', optionalAuthMiddleware, paymentLimiter, paymentController.createSubscription);
router.post('/verify', optionalAuthMiddleware, paymentLimiter, paymentController.verifyPayment);

router.get('/my-donations', authMiddleware, paymentController.getMyDonations);
router.get('/donation/:donationId', authMiddleware, paymentController.getDonationById);

// Admin Only: Issue a refund
router.post('/refund/:donationId', authMiddleware, adminMiddleware, paymentController.refundDonation);

module.exports = router;
