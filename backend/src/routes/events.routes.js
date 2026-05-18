const express = require('express');
const eventsController = require('../controllers/events.controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Public Routes
router.get('/', eventsController.listEvents);
router.get('/:slug', eventsController.getEventBySlug);

// Protected Registration Route
router.post('/:eventId/register', authMiddleware, eventsController.registerForEvent);

// Admin-Only CRUD Routes
router.post('/', authMiddleware, adminMiddleware, eventsController.createEvent);
router.put('/:eventId', authMiddleware, adminMiddleware, eventsController.updateEvent);
router.delete('/:eventId', authMiddleware, adminMiddleware, eventsController.deleteEvent);
router.get('/:eventId/registrations', authMiddleware, adminMiddleware, eventsController.getEventRegistrations);

module.exports = router;
