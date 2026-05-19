const express = require('express');
const partnersController = require('../controllers/partners.controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Public Routes
router.get('/', partnersController.listPartners);
router.get('/:slug', partnersController.getPartnerBySlug);

// Admin-Only Partnership CRUD
router.post('/', authMiddleware, adminMiddleware, partnersController.createPartner);
router.put('/:partnerId', authMiddleware, adminMiddleware, partnersController.updatePartner);
router.delete('/:partnerId', authMiddleware, adminMiddleware, partnersController.deletePartner);

module.exports = router;
