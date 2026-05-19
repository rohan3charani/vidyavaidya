const express = require('express');
const testimonialsController = require('../controllers/testimonials.controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Public Routes
router.get('/', testimonialsController.listTestimonials);

// Admin-Only Testimonial CRUD
router.post('/', authMiddleware, adminMiddleware, testimonialsController.createTestimonial);
router.put('/:testimonialId', authMiddleware, adminMiddleware, testimonialsController.updateTestimonial);
router.delete('/:testimonialId', authMiddleware, adminMiddleware, testimonialsController.deleteTestimonial);

module.exports = router;
