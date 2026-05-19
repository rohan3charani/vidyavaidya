const express = require('express');
const webhookController = require('../controllers/webhook.controller');

const router = express.Router();

// Razorpay asynchronous webhooks. 
// Note: This route utilizes req.rawBody populated in app.js for cryptographic validations.
router.post('/razorpay', webhookController.handleRazorpayWebhook);

module.exports = router;
