const express = require('express');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { paymentLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { createOrderSchema } = require('../schemas/donate.schema');

const router = express.Router();

// Apply auth protection to all payment paths
router.use(authMiddleware);

router.post('/create-order', paymentLimiter, validate(createOrderSchema), paymentController.createOrder);
router.post('/create-subscription', paymentLimiter, paymentController.createSubscription);
router.post('/verify', paymentLimiter, paymentController.verifyPayment);

router.get('/my-donations', paymentController.getMyDonations);
router.get('/donation/:donationId', paymentController.getDonationById);

// Admin Only: Issue a refund
router.post('/refund/:donationId', adminMiddleware, paymentController.refundDonation);

module.exports = router;
