const express = require('express');
const foreignDonorsController = require('../controllers/foreign-donors.controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Public route to submit inquiries
router.post('/', foreignDonorsController.createDonor);

// Admin-Only routes
router.get('/', authMiddleware, adminMiddleware, foreignDonorsController.listDonors);
router.put('/:id/status', authMiddleware, adminMiddleware, foreignDonorsController.updateDonorStatus);
router.delete('/:id', authMiddleware, adminMiddleware, foreignDonorsController.deleteDonor);

module.exports = router;
