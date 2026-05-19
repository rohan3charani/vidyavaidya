const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All user routes are protected by authMiddleware
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/dashboard', userController.getDashboard);
router.get('/donations', userController.getDonations);
router.get('/receipt/:donationId', userController.getReceiptUrl);
router.put('/change-email', userController.changeEmail);
router.post('/delete-account', userController.deleteAccount);

module.exports = router;
