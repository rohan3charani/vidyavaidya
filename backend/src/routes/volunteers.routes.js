const express = require('express');
const volunteersController = require('../controllers/volunteers.controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Public Routes
router.get('/', volunteersController.listVolunteers);

// Admin-Only CRUD
router.post('/', authMiddleware, adminMiddleware, volunteersController.createVolunteer);
router.put('/:volunteerId', authMiddleware, adminMiddleware, volunteersController.updateVolunteer);
router.delete('/:volunteerId', authMiddleware, adminMiddleware, volunteersController.deleteVolunteer);

module.exports = router;
