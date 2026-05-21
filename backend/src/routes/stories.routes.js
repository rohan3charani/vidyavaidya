const express = require('express');
const storiesController = require('../controllers/stories.controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Public Routes
router.get('/', storiesController.listStories);
router.get('/gallery/photos', storiesController.listPhotoGallery);
router.get('/gallery/videos', storiesController.listVideoGallery);

// Public Single Match (Placed after specific paths to prevent route collision)
router.get('/:slug', storiesController.getStoryBySlug);

// Admin-Only Media Storage Upload Route
router.post('/gallery/upload-url', authMiddleware, adminMiddleware, storiesController.getUploadUrl);
router.post('/gallery/upload-base64', authMiddleware, adminMiddleware, storiesController.uploadBase64);

// Admin-Only Article CRUD
router.post('/', authMiddleware, adminMiddleware, storiesController.createStory);
router.put('/:storyId', authMiddleware, adminMiddleware, storiesController.updateStory);
router.delete('/:storyId', authMiddleware, adminMiddleware, storiesController.deleteStory);

module.exports = router;
