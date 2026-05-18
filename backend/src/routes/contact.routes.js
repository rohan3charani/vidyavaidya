const express = require('express');
const contactController = require('../controllers/contact.controller');
const { contactLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { contactSchema, foreignInquirySchema } = require('../schemas/contact.schema');

const router = express.Router();

router.post('/', contactLimiter, validate(contactSchema), contactController.submitContact);
router.post('/foreign-inquiry', contactLimiter, validate(foreignInquirySchema), contactController.submitForeignInquiry);

module.exports = router;
